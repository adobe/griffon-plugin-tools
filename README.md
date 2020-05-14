# Project Griffon Plugin Tools

## Usage

Run the packager by executing the following command from the command line within your project's directory:

```
npx @adobe/griffon-packager
```

Run the uploader by executing the following command and passing in the package zip created above as an argument:

```
npx @adobe/griffon-uploader plugin-XXXXX.zip
```

### Configuration
In order to upload, you need to have an IMS account and set the following environment variables:

IMS Username `export IMS_USERNAME=XXXXX`

IMS Password `export IMS_PASSWORD=XXXXX`

Client Secret `export CLIENT_SECRET=XXXXX`

IMS Organization ID `export IMS_ORG=XXXXX`

_for Adobe internal use only_

ENV_NAME `export ENV_NAME=prod`

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE.md) for more information.