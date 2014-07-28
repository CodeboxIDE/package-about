define([
    "text!src/welcome.md"
], function(welcomeMessage) {
    var _ = codebox.require("hr/utils");
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");
    var File = codebox.require("models/file");
    var rpc = codebox.require("core/rpc");
    var storage = codebox.require("hr/storage");

    // Infos
    var helpUrl = "http://help.codebox.io/";
    var feedbackUrl = "https://github.com/CodeboxIDE/codebox/issues";

    // Cached methods
    var about = _.memoize(function() {
        return rpc.execute("codebox/about")
        .then(function(pkg) {
            var currentVersion = pkg.version;
            var lastVersion = storage.get("codeboxVersion");

            if (lastVersion == null) {
                commands.run("application.welcome");
            } else if (currentVersion != lastVersion) {
                commands.run("application.changes");
            }
            storage.set("codeboxVersion", currentVersion);

            return pkg;
        });
    });
    var releasesNotes = _.memoize(rpc.execute.bind(rpc, "codebox/changes"));

    // About dialog
    commands.register({
        id: "application.about",
        title: "Application: About",
        run: function() {
            return about()
            .then(function(pkg) {
                return dialogs.alert("Codebox version: "+pkg.version);
            });
        }
    });

    // Welcome message
    commands.register({
        id: "application.welcome",
        title: "Application: Welcome",
        run: function() {
            return commands.run("file.open", {
                file: File.buffer("welcome.md", welcomeMessage)
            })
        }
    });

    // Releases notes
    commands.register({
        id: "application.changes",
        title: "Application: Show Releases Notes",
        run: function() {
            return releasesNotes()
            .get("content")
            .then(function(content) {
                return commands.run("file.open", {
                    file: File.buffer("Releases Notes.md", content)
                })
            });
        }
    });

    // Open documentation
    commands.register({
        id: "application.help",
        title: "Application: Open Documentation",
        shortcuts: [
            "?"
        ],
        run: function() {
            window.open(helpUrl);
        }
    });

    // Open feedback
    commands.register({
        id: "application.feedback",
        title: "Application: Send Feedback",
        run: function() {
            window.open(feedbackUrl);
        }
    });

    // Open changes if version changes
    codebox.app.once("ready", function() {
        about();
    });
});