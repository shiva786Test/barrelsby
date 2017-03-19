"use strict";
var fs = require("fs");
var path = require("path");
var modules_1 = require("../modules");
var filesystem_1 = require("./filesystem");
var flat_1 = require("./flat");
function buildBarrels(destinations, options) {
    var builder;
    switch (options.structure) {
        default:
        case "flat":
            builder = flat_1.buildFlatBarrel;
            break;
        case "filesystem":
            builder = filesystem_1.buildFileSystemBarrel;
            break;
    }
    // Build the barrels.
    destinations.forEach(function (destination) { return buildBarrel(destination, builder, options); });
}
exports.buildBarrels = buildBarrels;
// Build a barrel for the specified directory.
function buildBarrel(directory, builder, options) {
    options.logger("Building barrel @ " + directory.path);
    var barrelContent = builder(directory, modules_1.loadDirectoryModules(directory, options), options);
    var indexPath = path.resolve(directory.path, options.indexName);
    fs.writeFileSync(indexPath, barrelContent);
    // Update the file tree model with the new index.
    if (!directory.files.some(function (file) { return file.name === options.indexName; })) {
        var index = {
            name: options.indexName,
            path: indexPath,
        };
        options.logger("Updating model index @ " + indexPath);
        directory.files.push(index);
        directory.index = index;
    }
}
