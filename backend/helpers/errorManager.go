package helpers

import "fmt"

func CheckErr(fromWhere string, err error) {
	if err != nil {
		fmt.Println(fromWhere, "->", err)
	}
}
