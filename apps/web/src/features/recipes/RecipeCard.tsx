type RecipeCardProps = {
  title: string;
  subtitle?: string;
  tags?: string[];
  imageUrl?: string;
  href?: string;
  source?: string;
};

export function RecipeCard({
  title,
  subtitle,
  tags = [],
  imageUrl,
  href,
  source,
}: RecipeCardProps) {
  const content = (
    <article className="recipe-card">
      <div
        className="recipe-card__image"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        aria-hidden="true"
      />

      <div className="recipe-card__body">
        <div className="recipe-card__top">
          <h3 className="recipe-card__title">{title}</h3>
          {source ? (
            <span className="recipe-card__source">{source}</span>
          ) : null}
        </div>

        {subtitle ? <p className="recipe-card__subtitle">{subtitle}</p> : null}

        {tags.length > 0 ? (
          <div className="recipe-card__tags">
            {tags.map((t) => (
              <span key={t} className="recipe-card__tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );

  return href ? (
    <a
      className="recipe-card__link"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    content
  );
}
