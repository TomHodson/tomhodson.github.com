// use axum::{
//     routing::{get,post},
//     Router,
// };
// use serde_json::Result;
// use serde::{Deserialize, Serialize};

// #[derive(Serialize, Deserialize, Copy)]
// struct State {
//     value: bool
// }

// static STATE: bool = false;

// async fn get_state() -> State {
//     &STATE
// }


// #[tokio::main]
// async fn main() {



    
//     // build our application with a single route
//     let app = Router::new()
//         .route("/get", get(get_state))
//         .route("/set", post(set_state));

//     // run our app with hyper, listening globally on port 3000
//     let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
//     axum::serve(listener, app).await.unwrap();
// }