from datetime import datetime

from statemachine import State, StateMachine
from django.contrib.auth.models import User

from .models import Machine, Booking

class BookingState(StateMachine):
    unspecified = State(initial=True)
    free = State()
    booked = State()

    process = free.from_(booked, unspecified, cond='is_active') | booked.from_(
        free, unspecified, cond='is_booked'
    )

    def __init__(self, machine: Machine):
        self.machine = machine
        super().__init__()

    def is_active(self):
        return self.machine.status == Machine.StatusEnum.ACTIVE

    def is_booked(self):
        return self.machine.status == Machine.StatusEnum.ACTIVE

    def on_enter_free(self):
        print('on enter free')
        self.machine.status = Machine.StatusEnum.ACTIVE

    def on_enter_booked(self, owner: User, start_datetime: datetime, end_datetime:datetime):
        new_booking = Booking.objects.create(
            machine=self.machine,
            bookedBy=owner,
            bookedFrom=start_datetime,
            bookedUntil=end_datetime,
        )
        self.machine.status = Machine.StatusEnum.BOOKED
        new_booking.save()

    def on_enter_unspecified(self):
        self.process()

