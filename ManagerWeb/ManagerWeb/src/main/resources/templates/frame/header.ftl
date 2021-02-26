<div class="page-header navbar navbar-fixed-top">
	<div class="page-header-inner">
		<div class="page-logo">
			<a href="index.html">
			<img src="${request.contextPath}/img/logo/logo.png" alt="logo" class="logo-express"/>
			</a>
			<div class="menu-toggler sidebar-toggler hide">
			</div>
		</div>
		<a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
		</a>
		<div class="top-menu">
			<ul class="nav navbar-nav pull-right">
				<li class="dropdown dropdown-extended dropdown-notification" id="header_notification_bar">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
					<i class="icon-bell"></i>
					<span class="badge badge-default">
					2 </span>
					</a>
					<ul class="dropdown-menu">
						<li class="external">
							<h3><span class="bold">2 </span> 条新通知</h3>
							<a href="extra_profile.html">更多</a>
						</li>
						<li>
							<ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">
								<li>
									<a href="javascript:;">
									<span class="time">刚刚</span>
									<span class="details">
									<span class="label label-sm label-icon label-success">
									<i class="fa fa-plus"></i>
									</span>
									快递信息更新. </span>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li class="dropdown dropdown-extended dropdown-inbox" id="header_inbox_bar">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
					<i class="icon-envelope-open"></i>
					<span class="badge badge-default">
					3 </span>
					</a>
					<ul class="dropdown-menu">
						<li class="external">
							<h3><span class="bold">3 </span> 封新邮件</h3>
							<a href="page_inbox.html">更多</a>
						</li>
						<li>
							<ul class="dropdown-menu-list scroller" style="height: 275px;" data-handle-color="#637283">
								<li>
									<a href="inbox.html?a=view">
									<span class="photo">
									<img src="" class="img-circle" alt="">
									</span>
									<span class="subject">
									<span class="from">
									张三</span>
									<span class="time">2 小时前 </span>
									</span>
									<span class="message">
									有新的派件快递 </span>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li class="dropdown dropdown-extended dropdown-tasks" id="header_task_bar">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
					<i class="icon-calendar"></i>
					<span class="badge badge-default">
					1 </span>
					</a>
					<ul class="dropdown-menu extended tasks">
						<li class="external">
							<h3><span class="bold">1 </span>个待完成任务</h3>
							<a href="page_todo.html">更多</a>
						</li>
						<li>
							<ul class="dropdown-menu-list scroller" style="height: 275px;" data-handle-color="#637283">
								<li>
									<a href="javascript:;">
									<span class="task">
									<span class="desc">当日派单数 </span>
									<span class="percent">30%</span>
									</span>
									<span class="progress">
									<span style="width: 40%;" class="progress-bar progress-bar-success" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"><span class="sr-only">40% Complete</span></span>
									</span>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li class="dropdown dropdown-user">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
					<img alt="" class="img-circle" src="${request.contextPath}/assets/admin/layout/img/avatar.png"/>
					<span class="username username-hide-on-mobile">
					<i class="fa fa-angle-down"></i>
					</a>
					<ul class="dropdown-menu dropdown-menu-default">
						<li>
							<a href="extra_profile.html">
							<i class="icon-user"></i> 个人资料 </a>
						</li>
						<li>
							<a href="inbox.html">
							<i class="icon-envelope-open"></i> 邮箱 <span class="badge badge-danger">
							3 </span>
							</a>
						</li>
						<li>
							<a href="page_todo.html">
							<i class="icon-rocket"></i> 任务 <span class="badge badge-success">
							1 </span>
							</a>
						</li>
						<li class="divider">
						</li>
						<li>
							<a href="extra_lock.html">
							<i class="icon-lock"></i> 锁屏 </a>
						</li>
					</ul>
				</li>
				<li class="dropdown dropdown-quick-sidebar-toggler">
					<a href="${request.contextPath}/logout" class="dropdown-toggle">
					<i class="icon-logout"></i>
					</a>
				</li>
			</ul>
		</div>
	</div>
</div>
<div class="clearfix">
</div>