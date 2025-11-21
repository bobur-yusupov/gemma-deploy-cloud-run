package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

const apiURL = "https://gemma-service-530483421367.europe-west4.run.app"

// Colors
const (
	colorReset  = "\033[0m"
	colorCyan   = "\033[36m"
	colorGreen  = "\033[32m"
	colorYellow = "\033[33m"
	colorRed    = "\033[31m"
	colorBold   = "\033[1m"
	colorDim    = "\033[2m"
)

type PromptRequest struct {
	Prompt string `json:"prompt"`
}

func chat(prompt string) error {
	req := PromptRequest{Prompt: prompt}
	body, _ := json.Marshal(req)

	res, err := http.Post(apiURL+"/infer-stream", "application/json", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("connection failed: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("API returned status %d", res.StatusCode)
	}

	io.Copy(os.Stdout, res.Body)
	return nil
}

func printBanner() {
	fmt.Printf("%s%s╔═══════════════════════════════════════╗%s\n", colorBold, colorCyan, colorReset)
	fmt.Printf("%s%s║        Yordamchi Chat CLI             ║%s\n", colorBold, colorCyan, colorReset)
	fmt.Printf("%s%s╚═══════════════════════════════════════╝%s\n", colorBold, colorCyan, colorReset)
	fmt.Printf("%s%sBuilt by Bobur Yusupov (dev-yusupov)%s\n", colorDim, colorCyan, colorReset)
	fmt.Printf("%sType your message and press Enter%s\n", colorDim, colorReset)
	fmt.Printf("%sCommands: /help, /clear, /exit (or Ctrl+C)%s\n\n", colorDim, colorReset)
}

func clearScreen() {
	fmt.Print("\033[H\033[2J")
}

func showHelp() {
	fmt.Printf("%s%sAvailable Commands:%s\n", colorBold, colorYellow, colorReset)
	fmt.Println("  /help  - Show this help message")
	fmt.Println("  /clear - Clear the screen")
	fmt.Println("  /exit  - Exit the chat")
	fmt.Println()
}

func main() {
	// Handle Ctrl+C gracefully
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-sigChan
		fmt.Printf("\n\n%s👋 Goodbye!%s\n", colorGreen, colorReset)
		os.Exit(0)
	}()

	clearScreen()
	printBanner()

	scanner := bufio.NewScanner(os.Stdin)

	for {
		fmt.Printf("%s%sYou:%s ", colorBold, colorGreen, colorReset)
		
		if !scanner.Scan() {
			break
		}

		prompt := strings.TrimSpace(scanner.Text())
		if prompt == "" {
			continue
		}

		// Handle commands
		switch prompt {
		case "/exit", "/quit":
			fmt.Printf("%s👋 Goodbye!%s\n", colorGreen, colorReset)
			return
		case "/clear":
			clearScreen()
			printBanner()
			continue
		case "/help":
			showHelp()
			continue
		}

		fmt.Printf("%s%sYordamchi:%s ", colorBold, colorCyan, colorReset)
		
		start := time.Now()
		if err := chat(prompt); err != nil {
			fmt.Printf("\n%s❌ Error: %v%s\n", colorRed, err, colorReset)
		} else {
			duration := time.Since(start)
			fmt.Printf(" %s(%.1fs)%s\n", colorDim, duration.Seconds(), colorReset)
		}
		fmt.Println()
	}
}
