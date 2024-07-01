<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_potd')]
    public function potd(): Response
    {
        return $this->render('home/potd.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/streak', name: 'app_streak')]
    public function streak(): Response
    {
        return $this->render('home/streak.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
}
