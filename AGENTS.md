# AGENT.md

## 代码提交规则

当且仅当用户**明确要求“提交代码”**时，Agent 才执行代码提交操作。

### 提交规范

* 提交信息必须遵循 **AngularJS Git Commit Message Conventions**
* 提交信息格式如下：

  <type>(<scope>): <subject>

    <body>

    <footer>

### 常用 type

* `feat`：新功能
* `fix`：修复问题
* `docs`：文档更新
* `style`：代码格式调整（不影响功能）
* `refactor`：重构
* `test`：测试相关
* `chore`：构建、工具或杂项维护

### 示例

```
feat(auth): add login API integration

Implement login request handling with token storage.

Closes #123
```

## 提交流程

当用户明确要求提交代码时，Agent 应：

1. 执行本地提交（`git commit`）
2. **不要推送到远程仓库**
3. 在完成提交后，告知用户推送命令

### 提交完成后的提示语

```
代码已提交。如需推送到远程仓库，请执行：

git push origin <branch-name>
```

其中，`<branch-name>` 应替换为当前分支名称。

## 注意事项

* 未明确要求时，禁止自动提交代码
* 提交信息必须语义清晰、简洁规范
* 不得自动执行 `git push`

