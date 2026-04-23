---
description: Apply Minecraft development best practices
---

# Best Practices - Java & Minecraft Development

1. **Performance**:
   - Use asynchronous operations for IO (database, files, web).
   - Avoid `instanceof` checks in hot loops (use polymorphism or caching).
   - Minimize use of `System.currentTimeMillis()` in loops; use `Bukkit.getCurrentTick()` if possible.
2. **Code Quality**:
   - Follow Java naming conventions (PascalCase classes, camelCase methods).
   - Use `final` where applicable.
   - Prefer `record` for data-only classes.
   - Always handle `Optional` and `null` values explicitly.
3. **Minecraft Specifics**:
   - Use the Adventure API for all messaging (MiniMessage).
   - Follow Paper/Spigot API idioms (e.g. use `LifecycleEvents` for modern Paper).
   - Relocate all shaded dependencies to prevent classpath conflicts.
4. **Gradle**:
   - Keep `build.gradle.kts` clean and organized.
   - Use toolchains for Java version management.
   - Externalize versions to properties or catalog.
