# react-timer

React eventful timer

Timer designed to work with react and event emitters.

## Configuration

See [example](example/config.json).

## Events

### Timer Events

#### started

Start has been called and timer has started

#### ticked

Tick callback called

#### paused

Pause has been called and timer is paused

#### stopped

Stop has been called and timer is stopped

#### reset

Reset has been called and timer is reset

### Session Events

#### session.started

Session has started

#### session.finished

Session has finished

### Set Events

#### set.started

Set has started

#### set.finished

Set has finished

### Phase Events

#### phase.started

Phase has started

#### phase.skipped

Phase has been skipped

#### phase.finished

Phase has finished

### Custom Events

#### custom-name

Custom time event triggered (+/- time)

## License

MIT