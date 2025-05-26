-- Script SQL avec mots de passe correctement hachés
-- Mot de passe pour tous les comptes: demo123

-- 1. Créer les établissements
INSERT INTO establishments (id, name, address, city, zipCode, phone, email) VALUES
('estab1', 'Lycée Jean Moulin', '123 Rue de la République', 'Lyon', '69003', '04 72 00 00 00', 'contact@lycee-jeanmoulin.fr'),
('estab2', 'Université Claude Bernard Lyon 1', '43 Boulevard du 11 Novembre 1918', 'Villeurbanne', '69100', '04 72 44 80 00', 'contact@univ-lyon1.fr'),
('estab3', 'École Supérieure de Commerce de Lyon', '23 Avenue Guy de Collongue', 'Écully', '69130', '04 78 33 78 00', 'contact@emlyon.com'),
('estab4', 'Institut Technique de Lyon', '15 Rue de la Technologie', 'Lyon', '69007', '04 72 73 00 00', 'contact@itlyon.fr');

-- 2. Créer les classes
INSERT INTO classes (id, name, level, establishmentId) VALUES
('class1', 'Terminale S1', 'Terminale', 'estab1'),
('class2', 'Terminale ES2', 'Terminale', 'estab1'),
('class3', 'Première L1', 'Première', 'estab1'),
('class4', 'L3 Informatique', 'Licence 3', 'estab2'),
('class5', 'M1 Data Science', 'Master 1', 'estab2'),
('class6', 'M2 Intelligence Artificielle', 'Master 2', 'estab2'),
('class7', 'MBA Marketing', 'MBA', 'estab3'),
('class8', 'Master Finance', 'Master', 'estab3'),
('class9', 'BTS Informatique 1ère année', 'BTS', 'estab4'),
('class10', 'BTS Informatique 2ème année', 'BTS', 'estab4'),
('class11', 'DUT Réseaux', 'DUT', 'estab4');

-- 3. Créer les utilisateurs avec mots de passe hachés
-- Hash pour "demo123": $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G

-- Administrateurs
INSERT INTO users (id, firstName, lastName, email, password, role, status, establishmentId) VALUES
('admin1', 'Admin', 'System', 'admin@letussign.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'ADMIN', 'ACTIVE', 'estab1'),
('admin2', 'Marie', 'Directrice', 'admin@univ-lyon1.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'ADMIN', 'ACTIVE', 'estab2'),
('admin3', 'Pierre', 'Gestionnaire', 'admin@emlyon.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'ADMIN', 'ACTIVE', 'estab3'),
('admin4', 'Sophie', 'Coordinatrice', 'admin@itlyon.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'ADMIN', 'ACTIVE', 'estab4');

-- Professeurs
INSERT INTO users (id, firstName, lastName, email, password, role, status, establishmentId) VALUES
('prof1', 'Jean', 'Martin', 'j.martin@lycee-jeanmoulin.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'PROFESSOR', 'ACTIVE', 'estab1'),
('prof2', 'Claire', 'Dubois', 'c.dubois@lycee-jeanmoulin.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'PROFESSOR', 'ACTIVE', 'estab1'),
('prof3', 'Michel', 'Bernard', 'm.bernard@univ-lyon1.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'PROFESSOR', 'ACTIVE', 'estab2'),
('prof4', 'Anne', 'Leroy', 'a.leroy@univ-lyon1.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'PROFESSOR', 'ACTIVE', 'estab2'),
('prof5', 'Thomas', 'Moreau', 't.moreau@emlyon.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'PROFESSOR', 'ACTIVE', 'estab3'),
('prof6', 'Emma', 'Petit', 'e.petit@itlyon.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'PROFESSOR', 'ACTIVE', 'estab4');

-- Étudiants
INSERT INTO users (id, firstName, lastName, email, password, role, status, establishmentId, classId) VALUES
('student1', 'Lucas', 'Roux', 'lucas.roux@student.lycee-jm.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab1', 'class1'),
('student2', 'Léa', 'Fournier', 'lea.fournier@student.lycee-jm.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab1', 'class1'),
('student3', 'Hugo', 'Girard', 'hugo.girard@student.lycee-jm.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab1', 'class2'),
('student4', 'Chloé', 'Bonnet', 'chloe.bonnet@student.lycee-jm.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab1', 'class3'),
('student5', 'Alexandre', 'Simon', 'alexandre.simon@etu.univ-lyon1.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab2', 'class4'),
('student6', 'Camille', 'Garcia', 'camille.garcia@etu.univ-lyon1.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab2', 'class4'),
('student7', 'Romain', 'Lopez', 'romain.lopez@etu.univ-lyon1.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab2', 'class5'),
('student8', 'Julie', 'Martinez', 'julie.martinez@etu.univ-lyon1.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab2', 'class6'),
('student9', 'Antoine', 'Wilson', 'antoine.wilson@student.emlyon.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab3', 'class7'),
('student10', 'Sarah', 'Anderson', 'sarah.anderson@student.emlyon.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab3', 'class8'),
('student11', 'Maxime', 'Taylor', 'maxime.taylor@student.itlyon.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab4', 'class9'),
('student12', 'Manon', 'Brown', 'manon.brown@student.itlyon.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'STUDENT', 'ACTIVE', 'estab4', 'class10');

-- 4. Créer les cours
INSERT INTO courses (id, name, subject, professorId, classId, date, startTime, endTime, status) VALUES
('course1', 'Mathématiques Avancées', 'Mathématiques', 'prof1', 'class1', '2024-12-02 09:00:00', '09:00', '11:00', 'SCHEDULED'),
('course2', 'Histoire Contemporaine', 'Histoire', 'prof2', 'class2', '2024-12-02 14:00:00', '14:00', '16:00', 'SCHEDULED'),
('course3', 'Algorithmes et Structures de Données', 'Informatique', 'prof3', 'class4', '2024-12-02 10:00:00', '10:00', '12:00', 'IN_PROGRESS'),
('course4', 'Machine Learning', 'Data Science', 'prof4', 'class5', '2024-12-02 15:00:00', '15:00', '17:00', 'SCHEDULED'),
('course5', 'Marketing Digital', 'Marketing', 'prof5', 'class7', '2024-12-02 11:00:00', '11:00', '13:00', 'COMPLETED'),
('course6', 'Réseaux et Télécommunications', 'Informatique', 'prof6', 'class9', '2024-12-02 08:00:00', '08:00', '10:00', 'COMPLETED');

-- 5. Créer les QR codes
INSERT INTO qr_codes (id, courseId, code, expiresAt, isActive, scansCount, maxScans) VALUES
('qr1', 'course1', 'QR_MATH_ADV_20241202', '2024-12-02 11:00:00', true, 0, 30),
('qr2', 'course2', 'QR_HIST_CONT_20241202', '2024-12-02 16:00:00', true, 0, 25),
('qr3', 'course3', 'QR_ALGO_STRUCT_20241202', '2024-12-02 12:00:00', true, 5, 20),
('qr4', 'course4', 'QR_ML_20241202', '2024-12-02 17:00:00', true, 0, 15),
('qr5', 'course5', 'QR_MARKETING_20241202', '2024-12-02 13:00:00', false, 12, 25),
('qr6', 'course6', 'QR_RESEAUX_20241202', '2024-12-02 10:00:00', false, 8, 20);

-- 6. Créer les signatures
INSERT INTO signatures (id, studentId, courseId, signatureData, status, ipAddress, userAgent) VALUES
('sig1', 'student5', 'course3', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'PRESENT', '192.168.1.100', 'Mozilla/5.0'),
('sig2', 'student6', 'course3', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'LATE', '192.168.1.101', 'Mozilla/5.0'),
('sig3', 'student9', 'course5', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'PRESENT', '192.168.1.102', 'Mozilla/5.0'),
('sig4', 'student10', 'course5', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'PRESENT', '192.168.1.103', 'Mozilla/5.0'),
('sig5', 'student11', 'course6', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'PRESENT', '192.168.1.104', 'Mozilla/5.0'),
('sig6', 'student12', 'course6', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'LATE', '192.168.1.105', 'Mozilla/5.0');

-- 7. Créer les alertes
INSERT INTO alerts (id, type, title, message, severity, userId, courseId, createdBy) VALUES
('alert1', 'ABSENCE', 'Absence détectée', 'Étudiant absent au cours de Mathématiques', 'MEDIUM', 'student1', 'course1', 'prof1'),
('alert2', 'LATE', 'Retard signalé', 'Étudiant en retard au cours d''Algorithmes', 'LOW', 'student6', 'course3', 'prof3'),
('alert3', 'SYSTEM', 'Maintenance programmée', 'Maintenance du système prévue ce weekend', 'LOW', NULL, NULL, 'admin1'),
('alert4', 'SECURITY', 'Tentative de connexion suspecte', 'Plusieurs tentatives de connexion échouées', 'HIGH', 'student5', NULL, 'admin2'),
('alert5', 'FREQUENT_ABSENCE', 'Absences répétées', 'Étudiant absent 3 fois cette semaine', 'HIGH', 'student3', NULL, 'admin1');

-- Afficher les comptes créés
SELECT 'COMPTES DE DÉMONSTRATION - Mot de passe: demo123' as info;
SELECT role, email, CONCAT(firstName, ' ', lastName) as nom FROM users ORDER BY role, email;
