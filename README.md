# Jumbl - AI-Based Crossword Generator

Jumbl is an AI-powered crossword puzzle generator that creates unique and challenging crosswords for users to solve. Leveraging advanced AI models and modern web technologies, Jumbl offers an engaging and interactive crossword experience.

<img width="1104" alt="cover" src="https://github.com/user-attachments/assets/b48fb2f4-a2cb-4b13-9b2d-3fdc1e36eec1">

## Overview

Jumbl was developed as part of the Hashnode AI for Tomorrow hackathon. The project aims to transform the classic crossword puzzle by integrating artificial intelligence to generate puzzles and provide hints, making the game more dynamic and personalized.
You can play a [crossword](https://jumbl.pages.dev/crossword/play/c58f0b8c-b14d-4e74-9831-bd73134cf89a) and see how it works.
You can read blog on how I developed Jumbl on [hashnode](https://shwetakale.hashnode.dev/building-jumbl-ai-based-crossword-generator)

## Features

- **AI-Generated Crosswords:** Creates unique crossword puzzles using the @hf/mistral/mistral-7b-instruct-v0.2 model.
- **Hint System:** Provides helpful hints using the @cf/meta/llama-2-7b-chat-fp16 model.
- **Interactive Interface:** Users can solve puzzles and interact with them through a React-based front end.
- **Responsive Design:** Designed to work seamlessly across various devices.

## Technical Stack

- **Frontend:** React
- **Deployment:** Cloudflare
- **Storage:** Cloudflare KV (Key-Value)
- **AI Models:**
  - `@hf/mistral/mistral-7b-instruct-v0.2` for crossword generation
  - `@cf/meta/llama-2-7b-chat-fp16` for hints
- **Puzzle Display and Interaction:**
  - `@jaredreisinger/react-crossword` for displaying and interacting with crosswords
  - `crossword-layout-generator` for generating puzzle layouts

## Installation

To run Jumbl locally, follow these steps:

1. **Clone the Repository**

    ```bash
    git clone https://github.com/raibove/jumbl.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd jumbl
    ```

3. **Install Dependencies**

    ```bash
    npm install
    ```

4. **Start the Development Server**

    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.

## Deployment

Jumbl is deployed on Cloudflare. To setup deployment you can create account on cloudflare and use instructions from Cloudflare docs to get started. 

## Usage

- Visit the Jumbl web app to start solving crosswords - https://jumbl.pages.dev/
- The AI generates new puzzles and provides hints to help you along the way.
- Enjoy the interactive user interface designed for a seamless experience.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for exploring Jumbl!
