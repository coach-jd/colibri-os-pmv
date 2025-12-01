// script.js
// Colibrí Reputation Lab · Lógica de interfaz y simulaciones
// ----------------------------------------------------------
// Este archivo concentra la lógica de interfaz del Panel de vuelo
// para el PMV Colibrí Reputation Lab.
//
// Bloques principales:
// 1) Simulación de la categoría "Métricas y Tracción" (7.1–7.3),
//    registro de la Evidencia 7/7 (simulado) y preparación de evolución
//    del NFT desde N1 · Semilla de Luz hacia N2 · Chispa Azul.
// 2) Control de pestañas principales (tabs), master–detail de categorías,
//    flujos rápidos desde el panel izquierdo y sincronización del Índice
//    Colibrí (IC) en el gráfico circular.

document.addEventListener('DOMContentLoaded', function () {
  // ---------------------------------------------------------------------------
  // 1) SIMULACIÓN MÉTRICAS Y TRACCIÓN (Categoría 7 · Nivel N1)
  // ---------------------------------------------------------------------------
  //   - Controla el conteo de microacciones completadas (7.1, 7.2, 7.3).
  //   - Actualiza badges de estado (Pendiente → IP cargada → Lista para registrar).
  //   - Habilita el botón para registrar la Evidencia 7/7 en Story Protocol (simulación).
  //   - Actualiza la credencial de la categoría 7 a "Obtenida" (Nivel N1).
  //   - Muestra el modal de evolución y, al confirmar, actualiza el NFT a N2 · Chispa Azul.

  // -----------------------
  // Variables de estado global
  // ---------------------------

  // Cantidad de microacciones de Métricas y Tracción que ya se marcaron como "cargadas".
  var completedMetricas = 0;

  // Total de microacciones requeridas para la categoría 7 en este nivel.
  var totalMetricas = 3;

  // Etiqueta donde se mostrará el progreso del tipo "0/3 completadas".
  var progressLabel = document.getElementById('metricas-progress-count');

  // Badge de la Evidencia 7 en la tarjeta principal de la categoría.
  var badgeEvidencia = document.getElementById('badge-metricas-evidencia');

  // Botón que abre el modal de Story Protocol para registrar la Evidencia 7.
  var btnRegistrarStory = document.getElementById('btn-registrar-story');

  // Badge de la credencial de Métricas & Tracción (Evidencia 7 completada).
  var badgeMetricasCredential = document.getElementById('badge-metricas-credential');

  // Imagen principal del NFT en el panel izquierdo.
  var nftImage = document.getElementById('nft-image');

  // Chip de nivel actual (N1 → N2) en el header, si existe.
  var badgeLevel = document.getElementById('badge-level');

  // Título principal del header (lado izquierdo, texto “Panel de vuelo · Nivel …”)
  var headerPanelTitle = document.getElementById('header-panel-title');

  // Resumen Ficha de Proyecto (Nivel NFT + IC asociado)
  var projectNftLevel = document.getElementById('project-nft-level');
  var projectNftIcBadge = document.getElementById('project-nft-ic-badge');

  // Badge del Índice Colibrí en el header (lado derecho) + spans internos.
  var badgeIC = document.getElementById('badge-ic');
  var icCurrentSpan = document.getElementById('ic-current');
  var icMaxSpan = document.getElementById('ic-max');

  // ---------------------------------------------------------------------------
  // Helper global de IC: anillo + chip de header
  // ---------------------------------------------------------------------------
  var progressRing = document.getElementById('progress-ring');
  var progressText = document.getElementById('progress-text');

  /**
   * Actualiza el Índice Colibrí (IC) de forma coherente en:
   * - Anillo SVG del panel izquierdo.
   * - Número dentro del anillo.
   * - Chip del header (usando #ic-current y #ic-max).
   * - Chip IC de la ficha del proyecto (IC: xx).
   */
  function updateICDisplay(value) {
    var max = 100;

    if (badgeIC && badgeIC.dataset.icMax) {
      var parsed = parseInt(badgeIC.dataset.icMax, 10);
      if (!isNaN(parsed) && parsed > 0) {
        max = parsed;
      }
    }

    // Anillo SVG (strokeDashoffset)
    if (progressRing) {
      var offset = 100 - (value / max) * 100;
      progressRing.style.strokeDashoffset = offset;
    }

    // Número dentro del anillo
    if (progressText) {
      progressText.textContent = String(value);
    }

    // Chip de header usando los spans internos
    if (badgeIC) {
      if (icCurrentSpan) icCurrentSpan.textContent = String(value);
      if (icMaxSpan) icMaxSpan.textContent = String(max);
    }

    // Ficha de proyecto (IC: 38 → IC: 42, por ejemplo)
    if (projectNftIcBadge) {
      projectNftIcBadge.textContent = 'IC: ' + String(value);
    }
  }

  // -------------------------------------------------------------------------
  // Función: updateMetricasProgress()
  // -------------------------------------------------------------------------
  // Actualiza el texto de progreso de las microacciones de Métricas y Tracción
  // y, cuando se completan las 3, habilita el botón para registrar la Evidencia.
  function updateMetricasProgress() {
    // Actualizar texto "X/3 completadas".
    if (progressLabel) {
      progressLabel.textContent =
        completedMetricas + '/' + totalMetricas + ' completadas · simulación';
    }

    // Si ya se marcaron las 3 IPs (7.1, 7.2 y 7.3)...
    if (completedMetricas === totalMetricas && btnRegistrarStory && badgeEvidencia) {
      // ...habilitar el botón de registro de evidencia compuesta.
      btnRegistrarStory.disabled = false;
      btnRegistrarStory.classList.remove('disabled');

      // Actualizar el badge de la Evidencia 7 a estado "Lista para registrar".
      badgeEvidencia.classList.remove('status-pendiente');
      badgeEvidencia.classList.add('status-progreso');
      badgeEvidencia.innerHTML =
        '<i class="bi bi-hourglass-split me-1"></i> Lista para registrar';
    }
  }

  // -------------------------------------------------------------------------
  // Manejo de los botones: ".btn-mark-ip-complete"
  // -------------------------------------------------------------------------
  // Cada botón dentro de los modales de la categoría 7 tiene la clase
  // .btn-mark-ip-complete y atributos:
  //   data-badge-id → id del badge de la microacción (7.1, 7.2 o 7.3).
  //   data-modal-id → id del modal que se debe cerrar tras confirmar.
  //
  // Al pulsar:
  //   - Marca la IP como "cargada (simulado)".
  //   - Incrementa el contador de microacciones completadas.
  //   - Actualiza el mensaje de progreso.

  var markButtons = document.querySelectorAll('.btn-mark-ip-complete');

  markButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var badgeId = button.getAttribute('data-badge-id');
      var modalId = button.getAttribute('data-modal-id');

      // 1) Marcar el badge de la IP como "cargada".
      if (badgeId) {
        var ipBadge = document.getElementById(badgeId);
        if (ipBadge) {
          ipBadge.classList.remove('status-pendiente');
          ipBadge.classList.add('status-completada');
          ipBadge.innerHTML =
            '<i class="bi bi-check-circle-fill me-1"></i> IP cargada (simulación)';
        }
      }

      // 2) Cerrar el modal correspondiente.
      if (modalId && window.bootstrap) {
        var modalEl = document.getElementById(modalId);
        if (modalEl) {
          var modalInstance = bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      }

      // 3) Incrementar el contador de microacciones completadas.
      if (completedMetricas < totalMetricas) {
        completedMetricas += 1;
      }

      // 4) Actualizar el progreso de Métricas y Tracción.
      updateMetricasProgress();
    });
  });

  // -------------------------------------------------------------------------
  // Botón: "Registrar Evidencia 7/7 en Story Protocol" (abrir modal)
  // -------------------------------------------------------------------------
  if (btnRegistrarStory) {
    btnRegistrarStory.addEventListener('click', function () {
      if (window.bootstrap) {
        var modalEl = document.getElementById('modal-story-evidencia');
        if (modalEl) {
          var instance = new bootstrap.Modal(modalEl);
          instance.show();
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // Botón: "Confirmar registro" en Story Protocol (simulación)
  // -------------------------------------------------------------------------
  // Este botón vive dentro del modal #modal-story-evidencia y, al pulsarlo:
  //   1) cambia el estado de la Evidencia 7 a "IP registrada";
  //   2) escribe un hash de ejemplo en el resumen;
  //   3) marca la credencial de Métricas y Tracción como obtenida (Nivel N1);
  //   4) cierra el modal de Story y abre el modal de evolución a N2.

  var btnConfirmStory = document.getElementById('btn-confirm-story');

  if (btnConfirmStory && badgeEvidencia) {
    btnConfirmStory.addEventListener('click', function () {
      // 1) Actualizar el estado visual de la Evidencia 7 en la tarjeta.
      badgeEvidencia.classList.remove('status-pendiente', 'status-progreso');
      badgeEvidencia.classList.add('ip-registered');
      badgeEvidencia.innerHTML =
        '<i class="bi bi-shield-lock-fill me-1"></i> IP registrada en Story (simulación)';

      // 2) Mostrar un hash simulado en el panel de Story Protocol.
      var hashPreview = document.getElementById('story-hash-preview');
      if (hashPreview) {
        hashPreview.textContent =
          '0xFAKE-COLIBRI-METRICAS-7EVIDENCIA-1234abcd5678ef90';
      }

      // 3) Actualizar la credencial de la categoría 7 a "Obtenida" (Nivel N1).
      if (badgeMetricasCredential) {
        badgeMetricasCredential.classList.remove('status-pendiente');
        badgeMetricasCredential.classList.add('status-completada');
        badgeMetricasCredential.innerHTML =
          '<i class="bi bi-patch-check-fill me-1"></i>' +
          'Badge: Métricas y Tracción — N1 (Obtenida)';
      }

      // 4) Cerrar el modal de Story Protocol.
      if (window.bootstrap) {
        var modalEl = document.getElementById('modal-story-evidencia');
        if (modalEl) {
          var instance = bootstrap.Modal.getInstance(modalEl);
          if (instance) instance.hide();
        }
      }

      // 5) Abrir el modal que anuncia la posibilidad de evolucionar a N2 · Chispa Azul.
      if (window.bootstrap) {
        var evoEl = document.getElementById('modal-evolution-n1');
        if (evoEl) {
          var evoInstance = new bootstrap.Modal(evoEl);
          evoInstance.show();
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // Botón: "Oficializar evolución a N2" (cambio integral de estado visual)
  // -------------------------------------------------------------------------
  // Cuando el usuario confirma la evolución:
  //   - Cambia la imagen del NFT de N1 · Semilla de Luz a N2 · Chispa Azul.
  //   - Actualiza el chip de nivel en el header y el título del header.
  //   - Actualiza identidad del NFT, IC, resumen de nivel y texto de ruta.
  //   - Actualiza la ficha de IPs y muestra el evento del timeline (Evidencia 7).
  //   - Cierra el modal y limpia cualquier backdrop residual.

  var btnConfirmEvolution = document.getElementById('btn-confirm-evolution');

  if (btnConfirmEvolution) {
    btnConfirmEvolution.addEventListener('click', function () {
      // Refs locales a elementos que queremos actualizar en el panel izquierdo
      var nftFrame = document.getElementById('nft-frame');
      var nftIdentidadNombre = document.getElementById('nft-identidad-nombre');
      var icEvidenciasResumen = document.getElementById('ic-evidencias-resumen');
      var icNarrativaNivel = document.getElementById('ic-narrativa-nivel');
      var level1EvidenciasCount = document.getElementById('level1-evidencias-count');
      var level1MicroaccionesCount = document.getElementById('level1-microacciones-count');
      var summaryLevelTitle = document.getElementById('summary-level-title');
      var summaryLevelDescription = document.getElementById('summary-level-description');
      var resumenNivelActual = document.getElementById('resumen-nivel-actual');
      var btnVerRutaSiguiente = document.getElementById('btn-ver-ruta-siguiente');
      var bloqueIC = document.getElementById('bloque-indice-colibri');
      var projectTotalIps = document.getElementById('project-total-ips');
      var timelineEv7 = document.getElementById('timeline-event-n1-cat7-ev7');

      // -------------------------------------------------------------------
      // 1) Imagen del NFT y metadatos de nivel
      // -------------------------------------------------------------------
      if (nftImage) {
        // Archivo del NFT en N2 (ajusta si usas otro nombre)
        nftImage.src = 'nft_n2_chispa_azul.svg';
        nftImage.alt = 'NFT Colibrí N2 · Chispa Azul';
        nftImage.setAttribute('data-current-level', '2');
        nftImage.setAttribute('data-current-level-key', 'N2');
        nftImage.setAttribute('data-current-level-name', 'Chispa Azul');
      }

      if (nftFrame) {
        nftFrame.setAttribute('data-current-level', '2');
      }

      // Sincronizar nivel NFT en la ficha del proyecto
      if (projectNftLevel) {
        projectNftLevel.textContent = 'N2 (Chispa Azul)';
      }

      if (projectNftIcBadge) {
        projectNftIcBadge.textContent = 'IC: 42'; // nuevo IC de ejemplo
      }

      // -------------------------------------------------------------------
      // 2) Chip de nivel en el header + título izquierdo
      // -------------------------------------------------------------------
      if (badgeLevel) {
        // Eliminar posibles clases de nivel previas
        badgeLevel.classList.remove('level-n0', 'level-n1');
        // Añadir clase para el nuevo nivel (definida en CSS)
        badgeLevel.classList.add('level-n2');
        // Actualizar el texto visible
        badgeLevel.textContent = 'N2 · Chispa Azul';
      }

      if (headerPanelTitle) {
        headerPanelTitle.textContent = 'Panel de vuelo · Nivel N2 · Chispa Azul';
      }

      // -------------------------------------------------------------------
      // 3) Identidad del Colibrí (título bajo la imagen)
      // -------------------------------------------------------------------
      if (nftIdentidadNombre) {
        nftIdentidadNombre.textContent = 'Colibrí #001 · Chispa Azul (N2)';
      }

      // -------------------------------------------------------------------
      // 4) Índice Colibrí (IC): valor, evidencias y narrativa
      // -------------------------------------------------------------------
      // Subimos el IC como resultado de completar la Evidencia 7.
      var nuevoIC = 42; // Ejemplo: de 38 → 42
      var icMax = 100;

      if (bloqueIC && bloqueIC.dataset.icMax) {
        icMax = parseInt(bloqueIC.dataset.icMax, 10) || 100;
      }

      // Anillo + header + ficha usando helper
      updateICDisplay(nuevoIC);

      if (icEvidenciasResumen) {
        icEvidenciasResumen.textContent = '7/7 evidencias';
      }

      if (icNarrativaNivel) {
        icNarrativaNivel.textContent =
          'Cada evidencia aumenta tu IC y revela nuevas capas de tu Colibrí. ' +
          'Al completar el Nivel N1 (Semilla de Luz), tu NFT evolucionó a N2 (Chispa Azul).';
      }

      // -------------------------------------------------------------------
      // 5) Resumen de nivel N1 (stats + texto de ruta)
      // -------------------------------------------------------------------
      if (level1EvidenciasCount) {
        level1EvidenciasCount.textContent = '7/7';
      }

      if (level1MicroaccionesCount) {
        level1MicroaccionesCount.textContent = '21/21';
      }

      if (resumenNivelActual) {
        // Cambiamos el estado visual de "en curso" a "completado"
        resumenNivelActual.classList.remove('resumen-n1-en-curso');
        resumenNivelActual.classList.add('resumen-n1-completado');
        // El siguiente nivel ahora es N3 (Ala Dorada)
        resumenNivelActual.setAttribute('data-next-level', '3');
      }

      if (summaryLevelTitle) {
        summaryLevelTitle.textContent = 'Nivel N1 completado · N2 activo';
      }

      if (summaryLevelDescription) {
        summaryLevelDescription.innerHTML =
          '<strong>Próxima ruta:</strong> N2 → N3 (Ala Dorada). ' +
          'Avanza en tu formación para revelar nuevas capas de tu Colibrí y ' +
          'desbloquear credenciales avanzadas.';
      }

      if (btnVerRutaSiguiente) {
        btnVerRutaSiguiente.setAttribute('data-from-level', '2');
        btnVerRutaSiguiente.setAttribute('data-to-level', '3');
        btnVerRutaSiguiente.innerHTML =
          'Ver ruta N2 → N3 completa <span aria-hidden="true">↗</span>';
      }

      // -------------------------------------------------------------------
      // 5.1) Mostrar evento del timeline de Evidencia 7 (si existe)
      // -------------------------------------------------------------------
      if (timelineEv7) {
        timelineEv7.classList.remove('d-none');
      }

      // -------------------------------------------------------------------
      // 5.2) Actualizar Total IPs registradas en la ficha del proyecto
      // -------------------------------------------------------------------
      if (projectTotalIps) {
        projectTotalIps.textContent = '21 Microacciones + 7 Evidencias (N1)';
      }

      // -------------------------------------------------------------------
      // 6) Cerrar el modal de evolución (Bootstrap) y limpiar cualquier backdrop
      // -------------------------------------------------------------------
      if (window.bootstrap) {
        var evoEl = document.getElementById('modal-evolution-n1');
        if (evoEl) {
          var evoInstance = bootstrap.Modal.getInstance(evoEl);
          if (evoInstance) {
            evoInstance.hide();
          } else {
            // Fallback por si no hubiera instancia asociada
            evoEl.classList.remove('show');
            evoEl.setAttribute('aria-hidden', 'true');
            evoEl.style.display = 'none';
          }
        }
      }

      // Fallback robusto: eliminar cualquier .modal-backdrop residual
      var backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(function (bd) {
        if (bd.parentNode) {
          bd.parentNode.removeChild(bd);
        }
      });

      // Quitar estado de "modal abierta" del body
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    });
  }

  // ---------------------------------------------------------------------------
  // 2) SISTEMA DE TABS PRINCIPALES Y MASTER–DETAIL DE CATEGORÍAS
  // ---------------------------------------------------------------------------
  // Botones de pestañas principales (Ficha, Timeline, Evidencias, Mecenazgo, etc.).
  var tabPills = document.querySelectorAll('.tab-pill');

  // Secciones de contenido asociadas a cada pestaña:
  //   - #tab-project-sheet
  //   - #tab-timeline
  //   - #tab-evidences
  //   - #tab-patronage
  //   (y cualquier otra que hayas definido)
  var tabSections = document.querySelectorAll('.tab-section');

  // Botones del grid de categorías de evidencias (Equipo, Problema, etc.).
  var categoryButtons = document.querySelectorAll('.category-grid-item');

  // Botones de acción rápida del panel izquierdo.
  var btnRegisterAction = document.getElementById('btn-register-action');
  var btnUploadEvidence = document.getElementById('btn-upload-evidence');

  // Enlace "Ver ficha" de la Ficha de Emprendimiento asociada (panel izquierdo).
  var btnVerFicha = document.getElementById('btn-ver-ficha');

  // ---------------------------------------------------------------------------
  // Función: activateMainTab(tabName)
  // ---------------------------------------------------------------------------
  // Activa una pestaña principal:
  //   tabName: 'project-sheet', 'timeline', 'evidences', 'patronage', etc.
  //
  function activateMainTab(tabName) {
    // 1. Desactivar pestañas y secciones activas.
    tabPills.forEach(function (button) {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    });

    tabSections.forEach(function (section) {
      section.classList.remove('active');
      section.setAttribute('aria-hidden', 'true');
    });

    // 2. Activar la pestaña principal correspondiente.
    var targetTabButton = document.querySelector(
      '.tab-pill[data-tab="' + tabName + '"]'
    );
    var targetTabSection = document.getElementById('tab-' + tabName);

    if (targetTabButton) {
      targetTabButton.classList.add('active');
      targetTabButton.setAttribute('aria-selected', 'true');
    }

    if (targetTabSection) {
      targetTabSection.classList.add('active');
      targetTabSection.setAttribute('aria-hidden', 'false');
    }
  }

  // ---------------------------------------------------------------------------
  // Función: activateCategoryDetail(categoryName)
  // ---------------------------------------------------------------------------
  // Activa el detalle de una categoría dentro de la pestaña de Evidencias:
  //   categoryName: 'equipo', 'problema', 'modelo', 'finanzas',
  //                 'timing', 'factores', 'metricas'.
  //
  function activateCategoryDetail(categoryName) {
    var categoryContents = document.querySelectorAll('.category-content');
    var targetContentId = 'category-' + categoryName;

    // 1. Desactivar todos los botones de categoría y sus contenidos.
    categoryButtons.forEach(function (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    categoryContents.forEach(function (content) {
      content.classList.remove('active');
      content.setAttribute('aria-hidden', 'true');
    });

    // 2. Activar el botón de categoría correspondiente.
    var targetButton = document.querySelector(
      '.category-grid-item[data-category="' + categoryName + '"]'
    );
    var targetContent = document.getElementById(targetContentId);

    if (targetButton) {
      targetButton.classList.add('active');
      targetButton.setAttribute('aria-pressed', 'true');
    }

    if (targetContent) {
      targetContent.classList.add('active');
      targetContent.setAttribute('aria-hidden', 'false');

      // Scroll suave al inicio del contenido en móviles (mejor UX)
      var rect = targetContent.getBoundingClientRect();
      var absoluteTop = window.pageYOffset + rect.top;
      window.scrollTo({
        top: absoluteTop - 80, // compensar la altura aproximada del header
        behavior: 'smooth',
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Eventos: Tabs principales
  // ---------------------------------------------------------------------------
  // Cada botón .tab-pill activa la pestaña correspondiente usando el
  // atributo data-tab.

  tabPills.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      var tabName = button.getAttribute('data-tab');
      if (tabName) {
        activateMainTab(tabName);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Eventos: Grid de categorías de evidencias
  // ---------------------------------------------------------------------------
  // Cada tarjeta de la grilla de categorías tiene data-category="equipo|problema|..."
  // y al pulsarla activamos el detalle correspondiente dentro de la pestaña.

  categoryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var categoryName = button.getAttribute('data-category');
      if (categoryName) {
        activateCategoryDetail(categoryName);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Eventos: Botones de acción rápida del panel izquierdo
  // ---------------------------------------------------------------------------
  // Estos botones permiten al usuario saltar directamente a la pestaña / categoría
  // más relevante para su próxima acción (registrar microacciones, subir evidencia, etc.).

  if (btnRegisterAction) {
    btnRegisterAction.addEventListener('click', function () {
      // Ir a pestaña "Timeline" directamente.
      activateMainTab('timeline');
    });
  }

  if (btnUploadEvidence) {
    btnUploadEvidence.addEventListener('click', function () {
      // Ir a pestaña "Evidencias" y abrir la categoría 7 (Métricas y Tracción).
      activateMainTab('evidences');
      activateCategoryDetail('metricas');
    });
  }

  if (btnVerFicha) {
    btnVerFicha.addEventListener('click', function () {
      // Mostrar pestaña "Ficha del Proyecto".
      activateMainTab('project-sheet');
    });
  }

  // ---------------------------------------------------------------------------
  // Inicialización de IC (estado inicial: N1 antes de evolución)
  // ---------------------------------------------------------------------------
  // Estado inicial: IC 38/100 (6 evidencias, 18 microacciones).
  updateICDisplay(38);

  // ---------------------------------------------------------------------------
  // Inicialización por defecto al cargar la interfaz
  // ---------------------------------------------------------------------------
  // 1) Mostrar la pestaña "Ficha del Proyecto" de inicio.
  activateMainTab('project-sheet');

  // 2) Preparar la pestaña de Evidencias con "Equipo Emprendedor" activa.
  activateCategoryDetail('equipo');

  // (Opcional) Aquí podrías añadir lógica genérica de niveles N2–N6.
});
