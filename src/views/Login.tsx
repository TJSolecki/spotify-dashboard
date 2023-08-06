function Login() {
  return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Spotify Dashboard</h1>
            <p className="py-6">Please login to get started and see your dashboard</p>
            <a href="/authenticate"><button className="btn btn-primary">Login</button></a>
          </div>
        </div>
      </div>
  );
}

export default Login;
