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
	isCountdownRunning bool
	countdownMutex     sync.Mutex
	lobbyFull          bool
	gameStarted        bool
)

func HandleActiveQueue(w http.ResponseWriter, r *http.Request) {
	fmt.Println("HandleActiveQueue attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		cookie, err := r.Cookie("socialNetworkSession")
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

		if len(queue) >= 0 {
			var msg SocketMessage
			msg.Type = "gameLogic"
			msg.GameStatus = "Start"
			msg.GameParty = gameParty
			broadcast <- msg
		}

		if len(queue) == 3 {
			lobbyFull = true
		}

		if len(queue) >= 2 {
			countdownMutex.Lock()
			if !isCountdownRunning {
				isCountdownRunning = true
				countdownMutex.Unlock()

				go func() {
					countdown := 20
					var msg SocketMessage

					for countdown > -1 {
						if lobbyFull {
							countdown = 10
							lobbyFull = false
							gameStarted = true
							var msg SocketMessage
							msg.Type = "gameLogic"
							msg.GameStatus = "Prepare"
							msg.GameParty = updateGameParty()
							msg.Grid = generateGrid()
							broadcast <- msg
						}

						time.Sleep(1 * time.Second)
						msg.Type = "countDown"
						msg.CountDown = countdown
						broadcast <- msg
						countdown--

						if !gameStarted && countdown == -1 {
							countdown = 10
							var msg SocketMessage
							msg.Type = "gameLogic"
							msg.GameStatus = "Prepare"
							msg.GameParty = updateGameParty()
							msg.Grid = generateGrid()
							broadcast <- msg
							gameStarted = true
						}
					}
					countdownMutex.Lock()
					isCountdownRunning = false
					countdownMutex.Unlock()

					msg.Type = "gameLogic"
					msg.GameStatus = "Fight"
					msg.GameParty = updateGameParty()
					broadcast <- msg
					gameStarted = true
					fmt.Println("GAME STARTED!!!")
				}()
			} else {
				countdownMutex.Unlock()
			}
		}
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleStatus", err)
		w.Write(writeData)
	}
}

func updateGameParty() []string {
	queue := validators.ValidateQueue()
	var gameParty []string
	for i := 0; i < len(queue); i++ {
		gameParty = append(gameParty, queue[i].UserId)
	}
	return gameParty
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
