<?php

declare(strict_types=1);

namespace Firebase\JWT;

use UnexpectedValueException;

final class ExpiredException extends UnexpectedValueException
{
    /** @var object|array<mixed>|null */
    private $payload;

    /**
     * @param object|array<mixed>|null $payload
     */
    public function setPayload($payload): void
    {
        $this->payload = $payload;
    }

    /**
     * @return object|array<mixed>|null
     */
    public function getPayload()
    {
        return $this->payload;
    }
}
?>