use std::env;
use std::io;
use std::io::prelude::*;
use std::net::TcpListener;
use std::net::TcpStream;

fn main() {
    // The only shared state of this tiny webserver
    let mut hitcount: usize = 0;

    // Bind to address given as argument or a default value.
    let address = env::args().nth(1).unwrap_or("127.0.0.1:8080".to_string());
    println!("Listening on {}", address);
    let listener = TcpListener::bind(address).unwrap();

    // Handle new connections in an infinite loop.
    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        let re = handle_connection(&mut stream, &mut hitcount);

        // Print out any errors
        if re.is_err() {
            println!("Error: {:?}", re);
        }
    }
}

fn handle_connection(stream: &mut TcpStream, hitcount: &mut usize) -> io::Result<()> {
    let mut buf = [0; 512];
    stream.read(&mut buf).expect("Failed to read from socket.");
    let request = str::from_utf8(&buf).expect("Request is not valid utf8");

    println!("Got request: {}", request.split("\r\n").nth(0).unwrap_or(&request));

    let (status, content) = if request.starts_with("GET / HTTP/1.1\r\n") {
        *hitcount = (*hitcount).saturating_add(1);
        ("200 OK", format!("{{\"hits\": {}}}\n", hitcount))
    } else {
        ("404 NOT FOUND", "404 not found".to_string())
    };

    let length = content.len();
    let response = format!(
        "HTTP/1.1 {status}\r\n\
                                    Content-Type: application/json\r\n\
                                    Content-Length: {length}
                                    \r\n\r\n\
                                    {content}"
    );

    stream.write(response.as_bytes())?;
    stream.flush()?;
    Ok(())
}
