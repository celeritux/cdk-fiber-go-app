package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Static("/", "./public", fiber.Static{
		Compress: true,
	})

	/*
		app.Get("/", func(c *fiber.Ctx) error {
			return c.SendFile("./public/index.html", true)
		})*/

	/*
		app.Get("/", func(c *fiber.Ctx) error {
			return c.SendString("Hello World")
		})
	*/

	err := app.Listen(":8080")
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Server started on port 8080")
	}
}
