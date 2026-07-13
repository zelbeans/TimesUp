from app.crud import make_crud_router
from app.models import Task
from app.schemas import TaskCreate, TaskRead, TaskUpdate

router = make_crud_router(
    model=Task,
    create_schema=TaskCreate,
    read_schema=TaskRead,
    update_schema=TaskUpdate,
    prefix="/tasks",
    tags=["tasks"],
)
