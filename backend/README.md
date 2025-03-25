## Useful commands
- **Adding DB model revision to Alembic**: alembic revision --autogenerate -m "Message"
- **Running to Alembic Head**: alembic upgrade head
- **Running**: uvicorn app.main:app --reload

## To do
- Add a schema model for ratings
- Have the ratings api use the ratings objects as response objects
- Update alembic and then test the star system