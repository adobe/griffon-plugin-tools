# Project Griffon Plugin Tools

## Usage

Run the packager by executing the following command from the command line within your project's directory:

```
npx @adobe/griffon-packager
```

Run the uploader by executing the following command in the directory that contains the zipped plugin package:

```
npx @adobe/griffon-uploader
```

### Configuration
In order to upload, you need to have an IMS account and set the following environment variables:

IMS Username `export IMS_USERNAME=XXXXX`

IMS Password `export IMS_PASSWORD=XXXXX`

Client Secret `export CLIENT_SECRET=XXXXX`

IMS Organization ID `export IMS_ORG=XXXXX`

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE.md) for more information.