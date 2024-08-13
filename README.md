# Driver Mapping System

The Driver Mapping System is a Node.js application that helps manage driver assignments and calculates distances between drivers and assignment locations.

## Features

- Retrieve drivers within a specified radius.
- Calculate distances between driver locations and assignment locations.
- Manage driver assignments.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/userrounakk/driver-mapping-system.git
    cd driver-mapping-system
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```env
    MONGODB_URI=mongodb://localhost:27017/your-database-name
    PORT=3000
    ```

## Running the Project

1. Start the MongoDB server:

    ```sh
    mongod
    ```

2. Start the Node.js server:

    ```sh
    npm start
    ```

3. The server will be running at `http://localhost:8000`.



## License

This project is licensed under the MIT License.