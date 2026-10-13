(() => {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const progress = document.getElementById("progress");
  const year = document.getElementById("year");
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (year) year.textContent = new Date().getFullYear();

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  const sections = [...document.querySelectorAll("section[id]")];
  const navAnchors = [...links.querySelectorAll("a")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";

    const y = window.scrollY + 120;
    let current = "home";
    sections.forEach((s) => {
      if (s.offsetTop <= y) current = s.id;
    });
    navAnchors.forEach((a) => {
      const href = a.getAttribute("href");
      if (href && href.includes("resume.html") && document.body.classList.contains("page-resume")) {
        a.classList.add("is-active");
        return;
      }
      a.classList.toggle("is-active", href === `#${current}` || href === `index.html#${current}`);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const revealEls = document.querySelectorAll(".reveal, .section-head, .about-photo");
  const revealWatch = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealWatch.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
  );

  document.querySelectorAll(".cards, .facts, .skills-wrap, .projects, .timeline, .hero-meta, .resume-side, .resume-main, .tags, .contact-list").forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.style.setProperty("--d", `${i * 0.1}s`);
    });
  });

  revealEls.forEach((el) => revealWatch.observe(el));

  const skills = document.querySelectorAll(".skill");
  const skillWatch = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.setProperty("--w", `${el.dataset.level}%`);
        el.classList.add("is-in");
        skillWatch.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  skills.forEach((s) => skillWatch.observe(s));

  if (!reduceMotion) {
    skills.forEach((skill) => {
      skill.addEventListener("pointermove", (event) => {
        const rect = skill.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 16;
        const rotateX = (0.5 - y) * 16;

        skill.style.setProperty("--tilt-x", `${rotateX}deg`);
        skill.style.setProperty("--tilt-y", `${rotateY}deg`);
      });

      skill.addEventListener("pointerleave", () => {
        skill.style.setProperty("--tilt-x", "0deg");
        skill.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  document.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      const type = btn.dataset.filter;
      document.querySelectorAll(".project").forEach((card) => {
        const show = type === "all" || card.dataset.cat === type;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      note.hidden = false;
      if (!data.name.trim() || !emailOk || !data.message.trim()) {
        note.textContent = "Please fill in a valid name, email, and message.";
        return;
      }
      const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`);
      window.location.href = `mailto:princekiandumlao22@gmail.com?subject=${subject}&body=${body}`;
      note.textContent = "Opening your email app to send the message.";
      form.reset();
    });
  }

  if (cursor && cursorDot) {
    const pos = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      cursorDot.style.left = `${pos.x}px`;
      cursorDot.style.top = `${pos.y}px`;
    });

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      cursor.style.left = `${ring.x}px`;
      cursor.style.top = `${ring.y}px`;
      requestAnimationFrame(tick);
    };
    tick();

    document.querySelectorAll("a, button, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  if (!reduceMotion) {
    document.querySelectorAll(".btn, .nav-cta").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const box = btn.getBoundingClientRect();
        const x = e.clientX - box.left - box.width / 2;
        const y = e.clientY - box.top - box.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }
})();
