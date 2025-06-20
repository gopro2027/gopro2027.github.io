


function generate_manifest(type, name, version, firmwareFileName) {
    //bootloader.bin is the same
    //partitions.bin is the same
    //boot_app0.bin is the samew

    var dependenciesDir = "firmware/manifold_dependencies/"
    var firmwareDir = "firmware/manifold/"
    if (type == "controller") {
        dependenciesDir = "firmware/controller_dependencies/"
        firmwareDir = "firmware/controller/"
    }

    var manifest = {
        "name": name,
        "version": version,
        "funding_url": "",
        "new_install_prompt_erase": true,
        "builds": [
            {
                "chipFamily": "ESP32",
                "improv": false,
                "parts": [
                    { "path": "../"+dependenciesDir+"bootloader.bin", "offset": 4096 },
                    { "path": "../"+dependenciesDir+"partitions.bin", "offset": 32768 },
                    { "path": "../"+dependenciesDir+"boot_app0.bin", "offset": 57344 },
                    { "path": "../"+firmwareDir+firmwareFileName, "offset": 65536 }
                ]
            }
        ]
    }

    var json = JSON.stringify(manifest);
    var blob = new Blob([json], {type: "application/json"});
    return URL.createObjectURL(blob)
}

function generateManifoldManifest(name, version, firmwareFileName) {
    return generate_manifest("manifold", name, version, firmwareFileName);
}

function generateControllerManifest(name, version, firmwareFileName) {
    return generate_manifest("controller", name, version, firmwareFileName);
}