# Activity Scheduler App

This is a simple activity scheduling application built with React and Vite, featuring AI-powered title suggestions using the Google Gemini API.

## Features

*   **Activity Management:** Add, view, and manage your daily activities.
*   **AI Title Suggestion:** Get concise and informative title suggestions for your activities using the Gemini API.
*   **Activity Analytics:** View basic analytics of your activities (e.g., activities per category, time spent).
*   **Client-Side Data Storage:** (Note: Currently, data is stored only in memory and will be lost upon refresh/closing the browser. Future enhancements could include persistent storage.)

## Application Preview

Here are some screenshots of the application in action:

<table>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/bayusegara27/activity-scheduler-app/refs/heads/master/preview/Activity%20Scheduler%20main%20menu.png" alt="Application Screenshot 1" width="480" height="270">
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/bayusegara27/activity-scheduler-app/refs/heads/master/preview/Activity%20Scheduler%20Add%20Activity.png" alt="Application Screenshot 2" width="480" height="270">
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/bayusegara27/activity-scheduler-app/refs/heads/master/preview/Activity%20Scheduler%20all%20activity.png" alt="Application Screenshot 3" width="480" height="270">
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/bayusegara27/activity-scheduler-app/refs/heads/master/preview/Activity%20Scheduler%20analytics.png" alt="Application Screenshot 4" width="480" height="270">
    </td>
  </tr>
</table>

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web projects.
*   **Bun:** A fast all-in-one JavaScript runtime.
*   **TypeScript:** A superset of JavaScript that adds static typing.
*   **Google Gemini API:** For AI-powered activity title suggestions.
*   **Tailwind CSS:** (If used, based on `cdn.tailwindcss.com` in your logs, though it's recommended to install it as a PostCSS plugin for production.)
*   **Recharts:** A composable charting library built on React components.

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository (if you haven't already)

```bash
git clone https://github.com/bayusegara27/activity-scheduler-app.git
cd activity-scheduler-app
```

### 2. Install Dependencies

This project uses `bun` as its package manager and runtime. If you don't have `bun` installed, you can install it globally:

```bash
npm install -g bun
# Or follow instructions at https://bun.sh/docs/installation
```

Once `bun` is installed, navigate to the project directory and install the dependencies:

```bash
bun install
```

### 3. Configure Google Gemini API Key

This application uses the Google Gemini API for AI title suggestions. You need to obtain an API key and configure it.

1.  **Get your Gemini API Key:**
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Sign in with your Google account.
    *   Create a new API key. It will typically start with `AIza...`.

2.  **Create a `.env.local` file:**
    In the root directory of your project (`E:/belajar/activity-scheduler-app/`), create a new file named `.env.local`.

3.  **Add your API Key to `.env.local`:**
    Open the `.env.local` file and add the following line, replacing `<YOUR_GEMINI_API_KEY>` with the actual API key you obtained:

    ```
    GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
    ```

    **Important:** Do not commit your `.env.local` file to version control (it's already included in `.gitignore`).

### 4. Run the Application

Once the dependencies are installed and the API key is configured, you can start the development server:

```bash
bun run dev
```

The application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).

### 5. Preview Production Build

To preview the production build of the application locally after running `bun run build` (which creates the `dist` folder), you can use the following command:

```bash
bun run preview
```

This will serve the static files from the `dist` directory.

## Usage

*   **Add Activity:** Use the form to add new activities.
*   **Get Title Suggestion:** Enter a description for your activity and click the "Suggest Title" button to get an AI-generated title.
*   **View Analytics:** Explore the analytics section to see insights into your activities.

## Contributing

We welcome contributions to this project! If you have suggestions for improvements or new features, please follow these steps:

1.  **Fork** the repository.
2.  **Create a new branch** for your feature or bug fix.
3.  **Make your changes** and ensure they adhere to the existing code style.
4.  **Test your changes** thoroughly.
5.  **Commit your changes** with a clear and concise message.
6.  **Push your branch** to your forked repository.
7.  **Open a Pull Request** to the `main` branch of this repository, describing your changes in detail.

