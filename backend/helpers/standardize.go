package helpers

import "strings"
func StandardizeString(name string) string {
	return strings.ToLower(name)
}
func StandardizeName(name string) string {
	middleman := StandardizeString(name)
	return strings.ToUpper(string(name[0])) + middleman[1:]
}
