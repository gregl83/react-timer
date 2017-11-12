# react-timer

React eventful timer

Timer designed to work with react and event emitters.

## Usage

React timer is an event based timer powered entirely by configuration objects.

The configuration is mainly divided into scopes which represent block(s) of time.

The three supported scopes in hierarchical tree order are: `sessions`, `sets`, and `phases`.

A configuration can only have one session but can have multiple sets which can in turn have multiple phases.

The two session types are: `dynamic` and `constant`. They define the timer's behavior in the event a phase is skipped.

Each scope will have it's own events and can have customer user defined events via the configuration.

The time object has methods for interacting with a configured session.

### Methods

#### init

Initialize the timer by indexing all events

#### start

Starts the timer

#### pause

Pauses timer which will no longer emit tick events or increment elapsed session time

#### skip

Skip a session phase if that phase has the `skip` configuration parameter set to `true`

#### stop

Same as pause with the difference being the session cannot be restarted

#### reset

Stops and resets the timer session

## Configuration

See [example](example/config.json).

## Events

### Timer Events

#### started

Start has been called and timer has started

#### ticked

Tick event emitted from interval timer once per second

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