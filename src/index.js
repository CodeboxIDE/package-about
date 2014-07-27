define([
    "text!src/welcome.md"
], function(welcomeMessage) {
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");
    var File = codebox.require("models/file");

    // About dialog
    commands.register({
        id: "about.show",
        title: "Application: About",
        shortcuts: [
            "mod+shift+a"
        ],
        run: function() {
            return dialogs.alert("About Codebox");
        }
    });

    // Welcome message
    commands.register({
        id: "about.welcome",
        title: "Application: Welcome",
        run: function() {
            return commands.run("file.open", {
                file: File.buffer("welcome.md", welcomeMessage)
            })
        }
    });
});a