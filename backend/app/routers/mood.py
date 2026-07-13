from app.crud import make_crud_router
from app.models import MoodEntry
from app.schemas import MoodEntryCreate, MoodEntryRead, MoodEntryUpdate

router = make_crud_router(
    model=MoodEntry,
    create_schema=MoodEntryCreate,
    read_schema=MoodEntryRead,
    update_schema=MoodEntryUpdate,
    prefix="/mood",
    tags=["mood"],
)
