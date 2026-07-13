from app.crud import make_crud_router
from app.models import PomodoroSession
from app.schemas import PomodoroSessionCreate, PomodoroSessionRead

router = make_crud_router(
    model=PomodoroSession,
    create_schema=PomodoroSessionCreate,
    read_schema=PomodoroSessionRead,
    prefix="/pomodoro-sessions",
    tags=["pomodoro"],
    allow_delete=False,
)
