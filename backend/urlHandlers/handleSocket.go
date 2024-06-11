package urlHandlers

import (
	"backend/validators"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		switch origin {
		case "http://localhost:3000",
			"ws://localhost:3000",
			"http://www.devpipe.ee",
			"http://devpipe.ee",
			"wss://www.devpipe.ee",
			"wss://devpipe.ee",
			"ws://www.devpipe.ee",
			"ws://devpipe.ee",
			"https://www.devpipe.ee",
			"https://devpipe.ee":
			return true
		}
		return false
	},
}

// var clients = make(map[*Client]bool)
var clientConnections = make(map[string]*Client)
var broadcast = make(chan SocketMessage)

type SocketMessage struct {
	Type              string      `json:"type"`
	Status            string      `json:"status"`
	FromId            string      `json:"fromuserid"`
	From_HandleSocket string      `json:"fromuserId"` //experimental
	Message           string      `json:"message"`
	Description       string      `json:"description"`
	To                string      `json:"touser"`
	Participation     string      `json:"participation"`
	ConnectedClients  []string    `json:"connectedclients"`
	NotificationId    string      `json:"NotificationId"`
	SenderEmail       string      `json:"SenderEmail"`
	EventTitle        string      `json:"EventTitle"`
	EventDescription  string      `json:"EventDescription"`
	EventTime         string      `json:"EventTime"`
	EventId           string      `json:"EventId"`
	GroupId           string      `json:"GroupId"`
	GroupTitle        string      `json:"GroupTitle"`
	Coords            string      `json:"coords"`
	GameStatus        string      `json:"gamestatus"`
	GameParty         []string    `json:"gameParty"`
	CountDown         int         `json:"countDown"`
	Grid              [31][21]int `json:"grid"`
}

type Client struct {
	connection  *websocket.Conn
	send        chan []byte
	connOwnerId string
	mu          sync.Mutex
	lastActive  time.Time
}

func periodicUserPresenceCheck() {
	for {
		time.Sleep(time.Minute)
		// Iterate through clients and update their online status based on lastActive
		currentTimestamp := time.Now()
		if len(clientConnections) > 0 {

		}
		for client := range clientConnections {
			clientConnections[client].mu.Lock()
			if currentTimestamp.Sub(clientConnections[client].lastActive) > 60*time.Minute {
				fmt.Println("TIMEOUT!")
				clientConnections[client].connection.Close()
				delete(clientConnections, client)

				users := []string{}
				for client := range clientConnections {
					users = append(users, clientConnections[client].connOwnerId)
				}
				allUsers := SocketMessage{
					Type:             "onlineStatus",
					Status:           "offline",
					ConnectedClients: users,
				}
				for client := range clientConnections {
					clientConnections[client].mu.Lock()
					err := clientConnections[client].connection.WriteJSON(allUsers)
					if err != nil {
						fmt.Println("Error broadcasting online status to client:", err)
						clientConnections[client].mu.Unlock()
						return
					}
					clientConnections[client].mu.Unlock()
				}
			} else {
				clientConnections[client].mu.Unlock()
			}
		}
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		switch msg.Type {
		case "message":
			// set new message into db
			validators.ValidateSetNewMessage(msg.FromId, msg.Message, msg.To)
			// send to user directly
			for client := range clientConnections {
				if msg.To == clientConnections[client].connOwnerId {
					clientConnections[client].mu.Lock()
					err := clientConnections[client].connection.WriteJSON(msg)
					if err != nil {
						fmt.Println("Error writing message to client:", err)
						clientConnections[client].mu.Unlock()
						return
					}
					clientConnections[client].mu.Unlock()
				}
			}
		case "groupMessage":
			validators.ValidateSetNewGroupMessage(msg.FromId, msg.Message, msg.GroupId)
			groupMembers := validators.ValidateGetGroupMembers(msg.GroupId)
			for _, groupMember := range groupMembers {
				if clientConnections[groupMember.Id] != nil && clientConnections[groupMember.Id].connOwnerId != msg.FromId {
					clientConnections[groupMember.Id].mu.Lock()
					err := clientConnections[groupMember.Id].connection.WriteJSON(msg)
					if err != nil {
						fmt.Println("Error writing message to client:", err)
						clientConnections[groupMember.Id].mu.Unlock()
						return
					}
					clientConnections[groupMember.Id].mu.Unlock()
				}
			}
		case "groupInvitation":
			returnedEmail, id := validators.ValidateSetNewGroupNotification(msg.FromId, msg.GroupId, msg.To)
			msg.NotificationId = id
			// Send noticication to user only if db insert was succssesful
			if returnedEmail != "" {
				msg.SenderEmail = returnedEmail

				for client := range clientConnections {
					if msg.To == clientConnections[client].connOwnerId {
						clientConnections[client].mu.Lock()
						err := clientConnections[client].connection.WriteJSON(msg)
						if err != nil {
							fmt.Println("Error writing gruopinvatation to client:", err)
							clientConnections[client].mu.Unlock()
							return
						}
						clientConnections[client].mu.Unlock()
					}
				}
			}
		case "groupRequest":
			id := validators.ValidateSetNewGroupRequest(msg.GroupId, msg.FromId, msg.To)
			msg.NotificationId = id

			if id != "" {
				for client := range clientConnections {
					if msg.To == clientConnections[client].connOwnerId {
						clientConnections[client].mu.Lock()
						err := clientConnections[client].connection.WriteJSON(msg)
						if err != nil {
							fmt.Println("Error writing gruopinvatation to client:", err)
							clientConnections[client].mu.Unlock()
							return
						}
						clientConnections[client].mu.Unlock()
					}
				}
			}

		case "event":
			//Insert new event into DB, then get all groupmembers from DB and send notification to all groupmembers, except event creator
			EventId, returnedEmail := validators.ValidateSetNewEvent(msg.GroupId, msg.FromId, msg.EventTitle, msg.EventDescription, msg.EventTime, msg.Participation)
			groupMembers := validators.ValidateGetGroupMembers(msg.GroupId)

			msg.EventId = EventId
			msg.SenderEmail = returnedEmail

			for client := range clientConnections {
				for _, eventReciever := range groupMembers {
					if eventReciever.Id == msg.FromId {
						continue
					}
					if client == eventReciever.Id {
						eventNotificationId := validators.ValidateSetNewEventNotification(msg.FromId, msg.GroupId, EventId, eventReciever.Id)
						msg.NotificationId = eventNotificationId
					}

					if eventReciever.Id == clientConnections[client].connOwnerId {
						clientConnections[client].mu.Lock()
						err := clientConnections[client].connection.WriteJSON(msg)
						if err != nil {
							fmt.Println("Error writing message to client:", err)
							clientConnections[client].mu.Unlock()
							return
						}
						clientConnections[client].mu.Unlock()
					}
				}
			}

		case "followUser":
			email := validators.ValidateSetNewFollowNotification(msg.From_HandleSocket, msg.To)
			msg.SenderEmail = email

			if email != "" {
				for client := range clientConnections {
					if msg.To == clientConnections[client].connOwnerId {
						clientConnections[client].mu.Lock()
						err := clientConnections[client].connection.WriteJSON(msg)
						if err != nil {
							fmt.Println("Error writing gruopinvatation to client:", err)
							clientConnections[client].mu.Unlock()
							return
						}
						clientConnections[client].mu.Unlock()
					}
				}
			}

		case "newPost":
			for client := range clientConnections {
				if msg.FromId != clientConnections[client].connOwnerId {
					clientConnections[client].mu.Lock()
					err := clientConnections[client].connection.WriteJSON(msg)
					if err != nil {
						fmt.Println("Error writing gruopinvatation to client:", err)
						clientConnections[client].mu.Unlock()
						return
					}
					clientConnections[client].mu.Unlock()
				}
			}

		case "refreshQueue":
			for client := range clientConnections {
				if msg.FromId != clientConnections[client].connOwnerId {
					clientConnections[client].mu.Lock()
					err := clientConnections[client].connection.WriteJSON(msg)
					if err != nil {
						fmt.Println("Error writing refreshQueue to client:", err)
						clientConnections[client].mu.Unlock()
						return
					}
					clientConnections[client].mu.Unlock()
				}
			}

		case "countDown":
			for client := range clientConnections {
				if msg.FromId != clientConnections[client].connOwnerId {
					clientConnections[client].mu.Lock()
					err := clientConnections[client].connection.WriteJSON(msg)
					if err != nil {
						fmt.Println("Error writing countDown to client:", err)
						clientConnections[client].mu.Unlock()
						return
					}
					clientConnections[client].mu.Unlock()
				}
			}

		case "gameLogic":
			for i := 0; i < len(msg.GameParty); i++ {
				if clientConnections[msg.GameParty[i]] != nil {
					fmt.Println("SENDING MESSAGE TO USERID: ", msg.GameParty[i])
					clientConnections[msg.GameParty[i]].mu.Lock()
					err := clientConnections[msg.GameParty[i]].connection.WriteJSON(msg)
					if err != nil {
						fmt.Println("Error writing gameLogic to client:", err)
						clientConnections[msg.GameParty[i]].mu.Unlock()
						return
					}
					clientConnections[msg.GameParty[i]].mu.Unlock()
				}
			}

		case "onlineStatus":
			var allUsers SocketMessage
			if msg.Message == "offline" {
				users := []string{}
				for client := range clientConnections {
					if clientConnections[client].connOwnerId != msg.FromId {
						users = append(users, clientConnections[client].connOwnerId)
					}
				}
				allUsers = SocketMessage{
					Type:             "onlineStatus",
					Status:           "offline",
					ConnectedClients: users,
				}
			} else {
				users := []string{}
				for client := range clientConnections {
					users = append(users, clientConnections[client].connOwnerId)
				}
				allUsers = SocketMessage{
					Type:             "onlineStatus",
					Status:           "online",
					ConnectedClients: users,
				}
			}
			// broadcast everyone that you are online/offline
			for client := range clientConnections {
				clientConnections[client].mu.Lock()
				err := clientConnections[client].connection.WriteJSON(allUsers)
				if err != nil {
					fmt.Println("Error broadcasting online status to client:", err)
					clientConnections[client].mu.Unlock()
					return
				}
				clientConnections[client].mu.Unlock()
			}
		}
	}
}

func HandleSocket(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Websocket attempt!")

	cookie, err := r.Cookie("socialNetworkSession")

	userId := validators.ValidateUserSession(cookie.Value)
	if userId == "0" {
		fmt.Println("User not allowed closing connection!")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	client := &Client{
		connection:  conn,
		connOwnerId: userId,
		send:        make(chan []byte, 256),
	}

	// clients[client] = true
	client.mu.Lock()
	clientConnections[userId] = client
	client.mu.Unlock()

	defer func() {
		client.mu.Lock()
		delete(clientConnections, userId)
		client.mu.Unlock()
	}()

	go handleMessages()
	// go periodicUserPresenceCheck()

	for {
		var msg SocketMessage
		msg.From_HandleSocket = userId

		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error in receiving message:", err)
			client.mu.Lock()
			delete(clientConnections, userId)
			broadcast <- SocketMessage{
				Type:   "onlineStatus",
				Status: "offline",
			}
			client.mu.Unlock()
			return
		}

		client.mu.Lock()
		client.lastActive = time.Now()
		client.mu.Unlock()
		broadcast <- msg
	}
}
