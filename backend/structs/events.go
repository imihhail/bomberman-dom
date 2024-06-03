package structs

type Events struct {
	EventId          string
	EventCreatorId   string
	GroupId          string
	EventTitle       string
	EventDescription string
	EventTime        string
	CreatorEmail     string
	Participants     []EventParticipant
}

type EventParticipant struct {
	ParticipantId    string
	ParticipantEmail string
}
