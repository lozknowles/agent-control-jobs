# Transport timeout

The supplied brief ended at the heading `TRANSPORT-TIMEOUT`; this `.md` file is the concrete deliverable used for that truncated name.

## Resolved design

The OpenAI-compatible provider creates a per-invocation Undici dispatcher. Its `headersTimeout` and `bodyTimeout` are bounded by the governed model-call deadline. The policy does not globally disable HTTP timeouts. Streaming response activity records meaningful progress, while a separate no-progress deadline can terminate an open but unproductive stream. Native fetch header expiry is normalized as `TRANSPORT_TIMEOUT`; governed model deadline, no-progress, caller cancellation, and generic transport failure remain distinct.

## Evidence and limitation

The Qwen3.8 call returned headers, streamed 512 tokens, and completed the HTTP response in 87.565 seconds. Provider timings were retained. It was not killed by the former 120-second harness limit because it completed sooner, and it did not approach the historical approximately 300-second Undici header boundary. The focused Linux tests independently exercised streaming progress, no-progress, fixed model deadline, keepalive rejection, and native-header-timeout classification.

Therefore the uncontrolled default has been removed from this path, but a real >300-second decoding request was not needed or observed in this qualification. This is stated as an untested physical combination, not as proof from absence.
