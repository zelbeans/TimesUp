from app.crud import make_crud_router
from app.models import SemesterEvent
from app.schemas import SemesterEventCreate, SemesterEventRead, SemesterEventUpdate

router = make_crud_router(
    model=SemesterEvent,
    create_schema=SemesterEventCreate,
    read_schema=SemesterEventRead,
    update_schema=SemesterEventUpdate,
    prefix="/events",
    tags=["events"],
)
