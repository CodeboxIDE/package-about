var welcomeMessage = require("./welcome.md");
var aboutMessage = require("./about.html");

var _ = codebox.require("hr.utils");
var storage = codebox.require("hr.storage");

var commands = codebox.require("core/commands");
var dialogs = codebox.require("utils/dialogs");
var File = codebox.require("models/file");
var rpc = codebox.require("core/rpc");

// Infos
var helpUrl = "http://help.codebox.io/";
var feedbackUrl = "https://github.com/CodeboxIDE/codebox/issues";

// Cached methods
var about = function() {
    var currentVersion = codebox.workspace.get('version');
    var lastVersion = storage.get("codeboxVersion");

    if (lastVersion == null) {
        commands.run("application.welcome");
    } else if (currentVersion != lastVersion) {
        commands.run("application.changes");
    }
    storage.set("codeboxVersion", currentVersion);
};
var releasesNotes = _.memoize(rpc.execute.bind(rpc, "codebox/changes"));

// About dialog
commands.register({
    id: "application.about",
    title: "Application: About",
    run: function() {
        return dialogs.alert(_.template(aboutMessage)(codebox.workspace.toJSON()), { isHtml: true });
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

codebox.statusbar.messages.collection.add({
    content: "Send Feedback",
    position: "right",
    click: function() {
        commands.run("application.feedback");
    }
});


// Open changes if version changes
codebox.app.once("ready", function() {
    about();
});

