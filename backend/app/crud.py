from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db


def make_crud_router(
    *,
    model,
    create_schema: type[BaseModel],
    read_schema: type[BaseModel],
    prefix: str,
    tags: list[str],
    update_schema: type[BaseModel] | None = None,
    allow_delete: bool = True,
) -> APIRouter:
    router = APIRouter(prefix=prefix, tags=tags)

    @router.get("", response_model=list[read_schema])
    def list_items(db: Session = Depends(get_db)):
        return db.scalars(select(model)).all()

    @router.post("", response_model=read_schema, status_code=201)
    def create_item(payload: create_schema, db: Session = Depends(get_db)):
        item = model(**payload.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    if update_schema is not None:

        @router.patch("/{item_id}", response_model=read_schema)
        def update_item(item_id: str, payload: update_schema, db: Session = Depends(get_db)):
            item = db.get(model, item_id)
            if item is None:
                raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
            for field, value in payload.model_dump(exclude_unset=True).items():
                setattr(item, field, value)
            db.commit()
            db.refresh(item)
            return item

    if allow_delete:

        @router.delete("/{item_id}", status_code=204)
        def delete_item(item_id: str, db: Session = Depends(get_db)):
            item = db.get(model, item_id)
            if item is None:
                raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
            db.delete(item)
            db.commit()
            return None

    return router
