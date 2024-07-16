<?php

namespace App\Controller;

use App\Entity\Player;
use App\Entity\PlayerToGuess;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_potd')]
    public function potd(EntityManagerInterface $em): Response
    {
        $player = $em->getRepository(PlayerToGuess::class)->findOneBy(["potd" => true]);

        return $this->render('home/potd.html.twig', [
            'controller_name' => 'HomeController',
            'player' => strtolower($player->getName()),
        ]);
    }

    #[Route('/streak', name: 'app_streak')]
    public function streak(): Response
    {
        return $this->render('home/streak.html.twig');
    }

    // Todo => return list of all players in JSON
    // Gets called at the start of the game
    #[Route('/getPlayerList', name: 'app_player_list', format: 'json')]
    public function getPlayerList(EntityManagerInterface $em): JsonResponse
    {
        $playerList = $em->getRepository(Player::class)->findAll();
        $playerNames = [];

        foreach ($playerList as $player) {
            $playerNames[] = strtolower($player->getName());
        }

        return $this->json($playerNames);
    }

    public function isPlayerValid(): bool
    {

        return false;
    }
}
