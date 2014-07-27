define([
    "text!src/welcome.md"
], function(welcomeMessage) {
    var _ = codebox.require("hr/utils");
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");
    var File = codebox.require("models/file");
    var rpc = codebox.require("core/rpc");

    var about = _.memoize(rpc.execute.bind(rpc, "codebox/about"));
    var releasesNotes = _.memoize(rpc.execute.bind(rpc, "codebox/changes"));

    // About dialog
    commands.register({
        id: "about.show",
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
        id: "about.welcome",
        title: "Application: Welcome",
        run: function() {
            return commands.run("file.open", {
                file: File.buffer("welcome.md", welcomeMessage)
            })
        }
    });

    // Releases notes
    commands.register({
        id: "about.releases",
        title: "Application: Releases Notes",
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

    // Put in cache version
    about();
});