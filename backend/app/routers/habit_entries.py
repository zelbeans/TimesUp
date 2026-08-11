from app.crud import make_crud_router
from app.models import HabitEntry
from app.schemas import HabitEntryCreate, HabitEntryRead, HabitEntryUpdate

router = make_crud_router(
    model=HabitEntry,
    create_schema=HabitEntryCreate,
    read_schema=HabitEntryRead,
    update_schema=HabitEntryUpdate,
    prefix="/habit-entries",
    tags=["habit-entries"],
)
