# Two steps for use :
- Create a file named `.env.local` in the root directory of the project.`
- Add the following line to the `.env.local` file, replacing `your_api_key_here` with your actual OpenAI API key:
  ```
  BASE_PROJECTS_PATH=/Users/<usename>/WebstormProjects
  ```
  

# Features
- List all web projects directories in the specified path.
- Delete node_modules directories within those projects.
- See the size of each node_modules directory before deletion.
- Search for a specific project by name.