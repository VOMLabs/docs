---
description: Auto-compile and commit using Conventional Commits with casual descriptions.
---

1. Run the build command for the current project:

   * If Maven: `mvn clean package`
   * If Gradle: `./gradlew clean build`

2. If the build fails, stop and notify the user about the errors.

3. Identify logical groups of changes (features, fixes, workflows, tools, etc.).

   * Each logical change MUST become its own commit.
   * Example:

     * Added agent workflows → `feat(agent): introduce design review skill (RAMS)`
     * Added AI chatbot → `feat(chatbot): add AI assistant`
   * Never bundle unrelated changes into a single commit.

4. For EACH change group:

   * Stage only the relevant files for that change.
     `git add <files>`

5. Generate a commit message following Conventional Commits with a short, casual description:

   * Format: `<type>(scope): <short description>`
   * Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   * Example:
     `feat(agent): introduce design review skill (RAMS)`

6. Commit the staged files:
   `git commit -m "<type>(scope): <short description>" -m "Casual description of changes"`

7. Repeat steps 4–6 until all change groups are committed.
