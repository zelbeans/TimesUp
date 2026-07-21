from app.crud import make_crud_router
from app.models import Habit
from app.schemas import HabitCreate, HabitRead, HabitUpdate

router = make_crud_router(
    model=Habit,
    create_schema=HabitCreate,
    read_schema=HabitRead,
    update_schema=HabitUpdate,
    prefix="/habits",
    tags=["habits"],
)
