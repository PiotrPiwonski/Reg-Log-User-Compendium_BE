#### Baza danych
Aby zaimportować bazę danych przy pomocy [phpMyAdmin](http://localhost/phpmyadmin), należy wykonać następujące kroki:
1. Otwórz **phpMyAdmin** i połącz się z serwerem bazy danych, do którego chcesz zaimportować bazę danych.
2. Kliknij na nazwę bazy danych (utwórz ją wcześniej, jeśli jeszcze jej nie ma) w lewym menu i wybierz opcję "Import" w górnym menu.
3. W sekcji "Plik do importu" kliknij przycisk "Wybierz plik" i wybierz plik z bazą danych, którą chcesz zaimportować. Plik znajdziesz w katalogu **sql**.
4. Na samym dole kliknij przycisk "Import".
5. Baza danych powinna zostać zaimportowana. Wszelkie problemy proszę zgłaszać na bieżąco.

#### Zmienne środowiskowe
Aby skonfigurować zmienne środowiskowe w swoim projekcie, należy wykonać następujące kroki:

1. Stwórz plik o nazwie .env, otwórz go i skopiuj do niego zawartość pliku .env.example. Plik .env.example zawiera przykładowe wartości dla zmiennych środowiskowych.
2. Otwórz plik .env i uzupełnij wartości dla poszczególnych zmiennych środowiskowych o swoje dane. Pamiętaj, aby nie usuwać nazw zmiennych ani znaku równości przed wartościami.
3. Zapisz zmiany w pliku .env.
4. Po wykonaniu powyższych kroków zmienne środowiskowe zostaną skonfigurowane w Twoim projekcie i będą gotowe do użycia.