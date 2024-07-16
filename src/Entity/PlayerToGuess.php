<?php

namespace App\Entity;

use App\Repository\PlayerToGuessRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PlayerToGuessRepository::class)]
class PlayerToGuess
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    private ?bool $potd = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function isPotd(): ?bool
    {
        return $this->potd;
    }

    public function setPotd(?bool $potd): static
    {
        $this->potd = $potd;

        return $this;
    }
}
