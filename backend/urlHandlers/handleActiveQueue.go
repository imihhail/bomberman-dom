package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

var (
	countdowns = make(map[string]bool)
	mutex      sync.Mutex
)

func HandleActiveQueue(w http.ResponseWriter, r *http.Request) {
	fmt.Println("HandleActiveQueue attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		cookie, _ := r.Cookie("socialNetworkSession")
		userId := validators.ValidateUserSession(cookie.Value)
		callback["login"] = "success"
		callback["userid"] = userId
		callback["useremail"] = validators.ValidateUserEmailFromId(userId)
		queue := validators.ValidateQueue()
		callback["gameQueue"] = queue
		var gameParty []string
		for i := 0; i < len(queue); i++ {
			gameParty = append(gameParty, queue[i].UserId)
		}

		if len(queue) >= 1 {
			mutex.Lock()
			if !countdowns[queueKey(gameParty)] {
				countdowns[queueKey(gameParty)] = true
				go startInitialCountdown(gameParty)
			}
			mutex.Unlock()
		}
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleActiveQueue", err)
		w.Write(writeData)
	}
}

func queueKey(gameParty []string) string {
	key := ""
	for _, id := range gameParty {
		key += id
	}
	return key
}

func startInitialCountdown(gameParty []string) {
	// change to 20 when ready
	countdown := 2
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for countdown >= 0 {
		select {
		case <-ticker.C:
			if len(gameParty) >= 4 {
				startFinalCountdown(gameParty)
				return
			}
			var msg SocketMessage
			msg.Type = "countDown"
			msg.CountDown = countdown
			msg.GameParty = gameParty
			broadcast <- msg
			countdown--
		}
	}
	startFinalCountdown(gameParty)
}

func startFinalCountdown(gameParty []string) {
	// change to 10 when ready
	countdown := 2

	groupId := validators.ValidateCreateNewGame(gameParty)
	validators.ValidateEmptyGameQueue(gameParty)
	newGroup := validators.ValidateActiveGameParty(groupId)
	var msg SocketMessage
	msg.GameParty = gameParty
	msg.Grid = generateGrid()
	msg.ActiveGameParty = newGroup
	msg.GameGroupId = groupId
	msg.Type = "gameLogic"
	msg.GameStatus = "Prepare"
	msg.CountDown = countdown
	broadcast <- msg
	for countdown >= 0 {
		msg.Type = "countDown"
		msg.CountDown = countdown
		time.Sleep(1 * time.Second)
		msg.Grid = [15][13]Cord{}
		broadcast <- msg
		countdown--
	}

	msg.Type = "gameLogic"
	msg.GameStatus = "Fight"
	msg.ActiveGameParty = newGroup
	msg.GameGroupId = groupId
	broadcast <- msg

	mutex.Lock()
	delete(countdowns, queueKey(gameParty))
	mutex.Unlock()
}

func rndNr(rng *rand.Rand) int {
	return rng.Intn(2)
}

func rndPwrUp(rng *rand.Rand) int {
	return rng.Intn(10)
}

type Cord struct {
	WallType int
	PowerUp  int
}

func generateGrid() [15][13]Cord {
	var grid [15][13]Cord

	var wallType int
	var powerUp int

	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	for y := 0; y < 13; y++ {
		for x := 0; x < 15; x++ {
			if x == 0 || y == 0 || x == 14 || y == 12 || (y%2 == 0 && x%2 == 0) {
				grid[x][y] = Cord{WallType: 9, PowerUp: 0}
			} else {
				wallType = rndNr(rng)

				if wallType == 1 {
					powerUp = rndPwrUp(rng)
				} else {
					powerUp = 0
				}
				grid[x][y] = Cord{WallType: wallType, PowerUp: powerUp}
			}
		}
	}

	grid[1][1] = Cord{WallType: 0, PowerUp: 0}
	grid[2][1] = Cord{WallType: 0, PowerUp: 0}
	grid[1][2] = Cord{WallType: 0, PowerUp: 0}

	grid[13][1] = Cord{WallType: 0, PowerUp: 0}
	grid[12][1] = Cord{WallType: 0, PowerUp: 0}
	grid[13][2] = Cord{WallType: 0, PowerUp: 0}

	grid[1][11] = Cord{WallType: 0, PowerUp: 0}
	grid[2][11] = Cord{WallType: 0, PowerUp: 0}
	grid[1][10] = Cord{WallType: 0, PowerUp: 0}

	grid[13][11] = Cord{WallType: 0, PowerUp: 0}
	grid[12][11] = Cord{WallType: 0, PowerUp: 0}
	grid[13][10] = Cord{WallType: 0, PowerUp: 0}

	return grid
}
