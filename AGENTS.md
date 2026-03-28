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

## WSL 项目与 Windows 预览规则

这是一个运行在 **WSL** 中的项目，但用户需要在 **Windows 浏览器** 中查看效果。

当 Agent 修改了 `.html` 文件后，必须额外告知用户该文件对应的 **Windows 可直接打开的 `file://` 路径**，以便用户在 Windows 浏览器中预览。

### 路径转换规则

如果 WSL 中的文件路径为：

```
/home/<user>/<project>/path/to/file.html
```

则应转换并展示为 Windows 可访问路径：

```
file://wsl.localhost/<发行版名称>/home/<user>/<project>/path/to/file.html
```

### 输出要求

当修改了 HTML 文件后，Agent 除了说明修改内容外，还应额外输出：

```
可在 Windows 浏览器中直接打开预览：
file://wsl.localhost/<发行版名称>/home/<user>/<project>/path/to/file.html
```

### 注意事项

* 仅当修改了 `.html` 文件时，才需要提供对应的 Windows `file://` 路径
* 路径必须与实际被修改的文件一一对应
* 不要只给出 WSL 路径，必须给出可在 Windows 浏览器中直接打开的 `file://` 路径
* 如果修改了多个 HTML 文件，应分别列出各自可打开的路径

## 注意事项

* 未明确要求时，禁止自动提交代码
* 提交信息必须语义清晰、简洁规范
* 不得自动执行 `git push`

