


function generate_manifest(dirName, name, version, firmwareFileName) {
    //bootloader.bin is the same
    //partitions.bin is the same
    //boot_app0.bin is the samew

    // var dependenciesDir = "https://oasman.dev/oasman/firmware/manifold_dependencies/"
    // var firmwareDir = "https://oasman.dev/oasman/firmware/manifold/"
    // if (type == "controller") {
    //     dependenciesDir = "https://oasman.dev/oasman/firmware/controller_dependencies/"
    //     firmwareDir = "https://oasman.dev/oasman/firmware/controller/"
    // }

    var dependenciesDir = "https://oasman.dev/oasman/firmware/" + dirName + "_dependencies/";
    var firmwareDir = "https://oasman.dev/oasman/firmware/" + dirName + "/";

    var manifest = {
        "name": name,
        "version": version,
        "funding_url": "",
        "new_install_prompt_erase": true,
        "builds": [
            {
                "chipFamily": "ESP32-S3",
                "improv": false,
                "parts": [
                    { "path": dependenciesDir+"bootloader.bin", "offset": 4096 }, // might need to update these values for the s3
                    { "path": dependenciesDir+"partitions.bin", "offset": 32768 },
                    { "path": dependenciesDir+"boot_app0.bin", "offset": 57344 },
                    { "path": firmwareDir+firmwareFileName, "offset": 65536 }
                ]
            }
        ]
    }

    // duplicate data for the s3 family
    manifest["builds"].push(manifest["builds"][0]);
    manifest["builds"][1]["chipFamily"] = "ESP32";

    console.log(manifest);

    var json = JSON.stringify(manifest);
    var blob = new Blob([json], {type: "application/json"});
    return URL.createObjectURL(blob)
}

