define(function() {
    var commands = codebox.require("core/commands");
    var dialogs = codebox.require("utils/dialogs");

    commands.register({
        id: "about.show",
        title: "About",
        shortcuts: [
            "mod+shift+a"
        ],
        run: function() {
            return dialogs.alert("About Codebox");
        }
    });
});