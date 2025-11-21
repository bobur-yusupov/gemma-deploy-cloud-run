# Yordamchi CLI - AI Chat Assistant

A beautiful command-line chat interface powered by Gemma AI.

## Features

✨ **Colorful UI** - Syntax-highlighted chat interface  
⚡ **Real-time Streaming** - See responses as they're generated  
⏱️ **Response Timing** - Track how long each response takes  
🎯 **Commands** - Built-in commands for better control  
🛡️ **Error Handling** - Graceful error messages and recovery  

## Build

```bash
cd cli
go build -o qcli
```

## Usage

```bash
./qcli
```

## Commands

- `/help` - Show available commands
- `/clear` - Clear the screen
- `/exit` - Exit the chat (or use Ctrl+C)

## Example

```
╔═══════════════════════════════════╗
║     🤖 Yordamchi AI Chat CLI         ║
╚═══════════════════════════════════╝
Type your message and press Enter
Commands: /help, /clear, /exit (or Ctrl+C)

You: What is Go?
Yordamchi: Go is a statically typed, compiled programming language... (1.2s)

You: /exit
👋 Goodbye!
```

## Install Globally

```bash
go install
```

Then use from anywhere:
```bash
qcli
```
