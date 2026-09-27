{ pkgs ? import <nixpkgs> {} }:

let
  pythonEnv = pkgs.python3.withPackages (ps: with ps; [
    flask
    flask-cors
  ]);
in
pkgs.mkShell {
  packages = [
    pythonEnv
  ];

  shellHook = ''
    echo "Python development environment initialized."
    python --version
  '';
}