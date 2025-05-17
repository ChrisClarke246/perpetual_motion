# perpetual_motion

To start locally
pip install -r requirements.txt && npm install --prefix frontend && npm run build --prefix frontend
and
gunicorn --config backend/gunicorn_config.py backend.run_prod:app