provider "google" {
  credentials = file("./cloudcomputing-389920-07e32f8a52c8.json")
  project     = "cloudcomputing-389920"
  region      = "us-central1"
}

resource "google_container_cluster" "my_cluster" {
  name               = "gke-demo"
  location           = "us-central1-c"
  initial_node_count = 1
  node_config {
    machine_type = "e2-medium"
    disk_size_gb = 10
  }
}
